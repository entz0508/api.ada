<? 
function get_dirname($i) {
	 $relative_path = preg_replace("`\/[^/]*\.php$`i", "/", $_SERVER['PHP_SELF']);
	 $dir = $relative_path;
	 $temp = explode("/", $dir);
	 if(sizeof($temp) > 2){
		$dirname = $temp[$i-1];
	 }else{
		$dirname = "";
	 }
	 return $dirname;
}
$path1 = get_dirname(3);
$path2 = get_dirname(4);
?>
<ul class="sidebar-menu" data-widget="tree">
        <li class="header">MAIN NAVIGATION
		</li>
          <li class="treeview <?=($path1 == "account")?"active":"" ?>">
              <a href="#">
                  <i class="fa fa-user"></i> <span>회원관리</span>
                  <span class="pull-right-container">
                      <i class="fa fa-angle-left pull-right"></i>
                  </span>
              </a>
              <ul class="treeview-menu">
                  <li <?=($path2 == "users.html")?"class=\"active\"":"" ?>><a href="/pages/account/users.html"><i class="fa fa-circle-o"></i> 회원검색</a></li>
				  <li <?=($path2 == "usersDrop.html")?"class=\"active\"":"" ?>><a href="javascript:;" onclick="javascript:alert('준비중입니다.');"><i class="fa fa-circle-o"></i> 탈퇴회원조회</a></li>
              </ul>
          </li>

          <li class="treeview <?=($path1 == "channel")?"active":"" ?>">
              <a href="#">
                  <i class="fa fa-newspaper-o"></i> <span>상품코드관리</span>
                  <span class="pull-right-container">
                      <i class="fa fa-angle-left pull-right"></i>
                  </span>
              </a>
              <ul class="treeview-menu">
                  <li <?=($path2 == "banners.html")?"class=\"active\"":"" ?>><a href="/pages/channel/banners.html"><i class="fa fa-circle-o"></i> 브렌드관리</a></li>
                  <li <?=($path2 == "banners.html")?"class=\"active\"":"" ?>><a href="/pages/channel/banners.html"><i class="fa fa-circle-o"></i> 카테고리관리</a></li>
                  <li <?=($path2 == "banners.html")?"class=\"active\"":"" ?>><a href="/pages/channel/banners.html"><i class="fa fa-circle-o"></i> 색상관리</a></li>
                  <li <?=($path2 == "banners.html")?"class=\"active\"":"" ?>><a href="/pages/channel/banners.html"><i class="fa fa-circle-o"></i> 패턴관리</a></li>
                  <li <?=($path2 == "banners.html")?"class=\"active\"":"" ?>><a href="/pages/channel/banners.html"><i class="fa fa-circle-o"></i> 스타일관리</a></li>
                  <li <?=($path2 == "banners.html")?"class=\"active\"":"" ?>><a href="/pages/channel/banners.html"><i class="fa fa-circle-o"></i> 컬렉션관리</a></li>
              </ul>
          </li>

          <li class="treeview <?=($path1 == "channel")?"active":"" ?>">
              <a href="#">
                  <i class="fa fa-newspaper-o"></i> <span>상품관리</span>
                  <span class="pull-right-container">
                      <i class="fa fa-angle-left pull-right"></i>
                  </span>
              </a>
              <ul class="treeview-menu">
                  <li <?=($path2 == "banners.html")?"class=\"active\"":"" ?>><a href="/pages/channel/banners.html"><i class="fa fa-circle-o"></i> 아이템관리</a></li>
                  <li <?=($path2 == "todays.html")?"class=\"active\"":"" ?>><a href="/pages/channel/todays.html"><i class="fa fa-circle-o"></i> 상품관리</a></li>
                  <li <?=($path2 == "todays.html")?"class=\"active\"":"" ?>><a href="/pages/channel/todays.html"><i class="fa fa-circle-o"></i> 피쳐드관리</a></li>
              </ul>
          </li>

          <li class="treeview <?=($path1 == "channel")?"active":"" ?>">
              <a href="#">
                  <i class="fa fa-newspaper-o"></i> <span>판매관리</span>
                  <span class="pull-right-container">
                      <i class="fa fa-angle-left pull-right"></i>
                  </span>
              </a>
              <ul class="treeview-menu">
                  <li <?=($path2 == "banners.html")?"class=\"active\"":"" ?>><a href="/pages/channel/banners.html"><i class="fa fa-circle-o"></i> 판매내역</a></li>
                  <li <?=($path2 == "todays.html")?"class=\"active\"":"" ?>><a href="/pages/channel/todays.html"><i class="fa fa-circle-o"></i> 장바구니내역</a></li>
                  <li <?=($path2 == "todays.html")?"class=\"active\"":"" ?>><a href="/pages/channel/todays.html"><i class="fa fa-circle-o"></i> 좋아요목록</a></li>
                  <li <?=($path2 == "todays.html")?"class=\"active\"":"" ?>><a href="/pages/channel/todays.html"><i class="fa fa-circle-o"></i> wish목록</a></li>
              </ul>
          </li>

		  <li class="treeview <?=($path1 == "userlog")?"active":"" ?>">
              <a href="#">
                  <i class="fa fa-bell-o"></i> <span>기타관리</span>
                  <span class="pull-right-container">
                      <i class="fa fa-angle-left pull-right"></i>
                  </span>
              </a>
              <ul class="treeview-menu">
                  <li <?=($path2 == "community.html")?"class=\"active\"":"" ?>><a href="/pages/userlog/community.html"><i class="fa fa-circle-o"></i> 배너관리</a></li>

              </ul>
          </li>
      </ul>