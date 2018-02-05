import louiesclubAPI from '../louiesclub-api'
import elasticsearch from '../elasticsearch'
import _ from 'lodash'
import moment from 'moment'
import esb from 'elastic-builder';
import logger from '../logger'




class MatchServices {

  constructor() {}



  async getFirstDog(user) {
    const dogId = _.get(user, 'dog_list_custom_dog.0')
    if (!dogId) {
      logger.warn(` user ${user._id} has not dog}`)
      // not dog
    }
    const dog = await louiesclubAPI.get(`/obj/dog/${dogId}`)
    if (!dog) {
      logger.warn(` user ${user._id} dog not found : ${dogId}}`)
      return
    }
    return dog
  }


  getHeuristicsFilter(user) {


    let userFilters = [
      // home_type_text,Same for both users
      esb.boolQuery().must([
        esb.termsQuery('home_type_text', user.home_type_text).boost(2)
      ]),
      esb.boolQuery().mustNot([
        esb.termsQuery('home_type_text', user.home_type_text)
      ])
    ]

    // Both users have a yard
    if (user.has_yard_boolean === true) {
      userFilters = userFilters.concat([
        esb.boolQuery().must([
          esb.termsQuery('has_yard_boolean', true).boost(2)
        ]),
        esb.boolQuery().mustNot([
          esb.termsQuery('has_yard_boolean', false)
        ])
      ])
    }



    let dogFilters;

    const dog = user.dog

    if (dog) {

      dogFilters = esb.boolQuery().should([
        // breeds_list_text
        esb.boolQuery().must([
          esb.termsQuery('dog_list_custom_dog.breeds_list_text', dog.breeds_list_text).boost(2)
        ]),
        esb.boolQuery().mustNot([
          esb.termsQuery('dog_list_custom_dog.breeds_list_text', dog.breeds_list_text)
        ]),
        // size_text
        esb.boolQuery().must([
          esb.termsQuery('dog_list_custom_dog.size_text', dog.size_text).boost(2)
        ]),
        esb.boolQuery().mustNot([
          esb.termsQuery('dog_list_custom_dog.size_text', dog.size_text)
        ]),
        // birth_date_date
        esb.boolQuery().must([
          esb.rangeQuery('dog_list_custom_dog.birth_date_date')
            .gte(moment(dog.birth_date_date).subtract(3, 'years').format())
            .lte(moment(dog.birth_date_date).add(3, 'years').format())
        ]).boost(2),
        esb.boolQuery().mustNot([
          esb.rangeQuery('dog_list_custom_dog.birth_date_date')
            .gte(moment(dog.birth_date_date).subtract(5, 'years').format())
            .lte(moment(dog.birth_date_date).add(5, 'years').format())
        ]),
        // calm_vs_playful_number
        esb.boolQuery().must([
          esb.rangeQuery('dog_list_custom_dog.calm_vs_playful_number')
            .gte(dog.calm_vs_playful_number - 1)
            .lte(dog.calm_vs_playful_number + 1)
        ]).boost(2),
        esb.boolQuery().mustNot([
          esb.rangeQuery('dog_list_custom_dog.calm_vs_playful_number')
            .gte(dog.calm_vs_playful_number - 3)
            .lte(dog.calm_vs_playful_number + 3)
        ]),
        // shy_vs_dominating_number
        esb.boolQuery().must([
          esb.rangeQuery('shy_vs_dominating_number.calm_vs_playful_number')
            .gte(dog.shy_vs_dominating_number - 1)
            .lte(dog.shy_vs_dominating_number + 1)
        ]).boost(2),
        esb.boolQuery().mustNot([
          esb.rangeQuery('dog_list_custom_dog.shy_vs_dominating_number')
            .gte(dog.shy_vs_dominating_number - 3)
            .lte(dog.shy_vs_dominating_number + 3)
        ]),
        // anxious_vs_relaxed_alone_number
        esb.boolQuery().must([
          esb.rangeQuery('dog_list_custom_dog.anxious_vs_relaxed_alone_number')
            .gte(dog.anxious_vs_relaxed_alone_number - 1)
            .lte(dog.anxious_vs_relaxed_alone_number + 1)
        ]).boost(2),
        esb.boolQuery().mustNot([
          esb.rangeQuery('dog_list_custom_dog.anxious_vs_relaxed_alone_number')
            .gte(dog.anxious_vs_relaxed_alone_number - 3)
            .lte(dog.anxious_vs_relaxed_alone_number + 3)
        ]),
        // timid_number
        esb.boolQuery().must([
          esb.rangeQuery('dog_list_custom_dog.timid_number')
            .gte(dog.timid_number - 1)
            .lte(dog.timid_number + 1)
        ]).boost(2),
        esb.boolQuery().mustNot([
          esb.rangeQuery('dog_list_custom_dog.anxious_vs_relaxed_alone_number')
            .gte(dog.timid_number - 3)
            .lte(dog.timid_number + 3)
        ]),
        // active_number
        esb.boolQuery().must([
          esb.rangeQuery('dog_list_custom_dog.active_number')
            .gte(dog.active_number - 1)
            .lte(dog.active_number + 1)
        ]).boost(2),
        esb.boolQuery().mustNot([
          esb.rangeQuery('dog_list_custom_dog.active_number')
            .gte(dog.active_number - 3)
            .lte(dog.active_number + 3)
        ]),
      ])
    }

    if (dogFilters) {
      return esb.boolQuery().should(
        userFilters.concat(esb.nestedQuery().path('dog_list_custom_dog').query(dogFilters))
      )
    }


    return esb.boolQuery().should(userFilters)

  }


  // Personas filter (level 1)
  // hosting_page_complete__boolean and dog_added__boolean
  getPersonasFilter(user) {
    logger.debug(" getPersonasFilter", user.hosting_page_complete__boolean, user.dog_added__boolean)
    let filters = []
    if (user.hosting_page_complete__boolean === true && user.dog_added__boolean === true) {
      // Case 1: People with dogs AND hosting
      filters.push(esb.boolQuery().should([
        esb.termQuery('hosting_page_complete__boolean', true),
        esb.termQuery('dog_added__boolean', true),
      ]))
    } else if (user.hosting_page_complete__boolean === true && user.dog_added__boolean === false) {
      // Case 2: People without dogs but can take care of dogs
      filters.push(
        esb.termQuery('dog_added__boolean', true)
      )
    } else if (user.hosting_page_complete__boolean === false && user.dog_added__boolean === true) {
      // Case 3: People with dogs AND NOT hosting
      filters.push(
        esb.termQuery('hosting_page_complete__boolean', true),
        esb.termQuery('dog_added__boolean', false)
      )
    } else {
      // match null?
    }
    return filters
  }


  getLocationFilter(user) {
    return esb.geoDistanceQuery().field('zip_code_address_geographic_address.location')
      .distance('30miles')
      .geoPoint(
        esb.geoPoint()
          .lat(user.zip_code_address_geographic_address.lat)
          .lon(user.zip_code_address_geographic_address.lng)
      )
  }






  getPreferenceFilter(user) {
    let preferenceFilters = []
    // Applies only to case 1 and case 2, which dogs does the user need?
    if (user.hosting_page_complete__boolean === true) {

      let filters = []
      // Prefers dogs of a certain size
      if (user.can_host_sizes_list_text && user.can_host_sizes_list_text.length > 0) {
        filters.push(
          esb.termsQuery('dog_list_custom_dog.size_text', user.can_host_sizes_list_text)
        )
      }

      // Only wants neutered dogs
      if (user.host_neutered_only__boolean === true) {
        filters.push(
          esb.termQuery('dog_list_custom_dog.neutered__boolean', true)
        )
      }

      // Only wants non-shedding dogs
      if (user.host_non_shedding_only__boolean === true) {
        filters.push(
          esb.termQuery('dog_list_custom_dog.non_shedding__boolean', true)
        )
      }

      // Has a cat
      if (user.cats_in_home1_boolean === true) {
        filters.push(
          esb.termQuery('dog_list_custom_dog.gets_along_with_cats__boolean', true)
        )
      }

      // Has Kids
      if (user.has_kids_boolean === true) {
        filters.push(
          esb.termQuery('dog_list_custom_dog.gets_along_with_kids__boolean', true)
        )
      }

      // Has a dog
      if (user.dog_added__boolean === true) {
        filters.push(
          esb.termQuery('dog_list_custom_dog.gets_along_with_dogs__boolean', true)
        )
      }

      if (filters.length > 0) {
        preferenceFilters.push(esb.nestedQuery().path('dog_list_custom_dog').query(
          esb.boolQuery().must(filters)
        ))
      }
    }
    // Applies only to case 1 and case 3, which user does the dog need?
    if (user.dog_added__boolean === true && user.dog) {


      const { dog } = user

      let filters = []

      // Is of certain size
      if (dog.size_text) {
        filters.push(
          esb.termsQuery('can_host_sizes_list_text', dog.size_text)
        )
      }

      // People who have NOT checked ‘only neutered’
      if (dog.neutered__boolean === false) {
        filters.push(
          esb.termQuery('host_neutered_only__boolean', false)
        )
      }

      // People who have NOT checked ‘only non-shedding’
      if (dog.neutered__boolean === false) {
        filters.push(
          esb.termQuery('host_non_shedding_only__boolean', false)
        )
      }

      // People who have no cats
      if (dog.gets_along_with_cats__boolean === false) {
        filters.push(
          esb.termQuery('cats_in_home1_boolean', false)
        )
      }

      // People who have no Kids
      if (dog.gets_along_with_kids__boolean === false) {
        filters.push(
          esb.termQuery('has_kids_boolean', false)
        )
      }

      // People who have no dogs
      if (dog.gets_along_with_dogs__boolean === false) {
        filters.push(
          esb.termQuery('dog_added__boolean', false)
        )
      }

      if (filters.length > 0) {
        preferenceFilters = preferenceFilters.concat(filters)

      }
    }

    return preferenceFilters
  }



  async getQuery(user) {
    const query = esb.boolQuery().must(
      this.getPersonasFilter(user)
        .concat(this.getPreferenceFilter(user))
        .concat(this.getLocationFilter(user))
        .concat(this.getHeuristicsFilter(user))
    )
    esb.prettyPrint(query)
    return query
  }




  async searchUser(user) {
    const results = await elasticsearch.search({
      index: 'louiesclub_feb',
      type: 'user',
      body: { query: await this.getQuery(user) }
    })
    return results.hits.hits;
  }


  async matchHosting(userId) {
    const user = await louiesclubAPI.get(`/obj/user/${userId}`)
    const dog = await this.getFirstDog(user)
    if (dog) {
      user.dog = dog
    }
    const results = await this.searchUser(user)
    logger.debug("user", user)
    return { user, matches: _.map(results, '_source') }
  }
}




const matchServices = new MatchServices()


export default matchServices

