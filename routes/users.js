/**
 * 用户管理模块
 */
const router = require('koa-router')()
const User = require('./../models/userSchema')
const util = require('./../utils/util')
const jwt = require('jsonwebtoken')
router.prefix('/users')

//定义路由
router.post('/login',async (ctx)=>{

  try {
  const { userName, userPwd } = ctx.request.body;
  /**
   * 返回数据库指定字段 有三种方式
   * 1. 'userId userName userEmail state role deptId roleList'
   * 2. {userId:1} 1返回 2不返回
   * 3. select('user')
   */
  const res =  await User.findOne({
    userName, 
    userPwd
  },'userId userName userEmail state role deptId roleList')
  const data = res._doc;
  const token =  jwt.sign({
    data:data,
  },'lwq',{ expiresIn: '1h' })
  if(res){
    data.token = token;
    ctx.body = util.success(res);
  }else{
    ctx.body = util.fail('账号信息不正确');
  }
  } catch (error) {
    ctx.body = util.fail(error.msg);
  }
})


module.exports = router
