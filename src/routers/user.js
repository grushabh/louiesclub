import Router from 'koa-router'
import matchServices from '../services/match'
import matchHostingServices from '../services/match-hosting'

const router = new Router({
  prefix: '/user'
})


/**
 * @api {get} /user/:userId/matches  get match users
 * @apiVersion 1.0.0
 * @apiName match users
 * @apiParam {int} userId
 * @apiGroup user
 *
 * @apiSuccess {Object}  user
 * @apiSuccessExample Success-Response:
 *
 * {
 *  "user":{},
 *  "matches":[]
 * }
 *
 */
router.get('/:userId/matches', async ctx => {
  const { userId } = ctx.params
  ctx.body = await matchServices.match(userId)
})

/**
 * @api {get} /user/:userId/hosting  get match hosting
 * @apiVersion 1.0.0
 * @apiName match hosting
 * @apiParam {int} userId
 * @apiGroup user
 *
 * @apiSuccess {Object}  user
 * @apiSuccessExample Success-Response:
 *
 * {
 *  "user":{},
 *  "matches":[]
 * }
 *
 */
router.get('/:userId/hosting', async ctx => {
  const { userId } = ctx.params
  ctx.body = await matchHostingServices.matchHosting(userId)
})

export default router

