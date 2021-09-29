import router from '../router'

//返回上一页
const $backPage = () => {
  router.go(-1)
}
export default
{
  $backPage
}