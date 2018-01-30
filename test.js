const esb = require('elastic-builder');
const query = esb.boolQuery().must([
  esb.termQuery('hosting_page_complete__boolean', true),
  esb.termQuery('dog_added__boolean', true),
  esb.boolQuery().should(
    esb.nestedQuery().path('dog_list_custom_dog')
    .query(
      esb.boolQuery().must([
        esb.termQuery('dog_list_custom_dog.breeds_list_text', 'Maltese').boost(2)
      ])
    )
  )
])
esb.prettyPrint(query)

