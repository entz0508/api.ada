<?
session_start();
if(!isset($_SESSION['user_login']) || !isset($_SESSION['user_name'])) {
	echo "<meta http-equiv='refresh' content='0;url=/'>";
	exit;
}
                require_once($_SERVER['DOCUMENT_ROOT']."/inc/dbcon.php");
                require_once($_SERVER['DOCUMENT_ROOT']."/inc/lib.php");
                
                if(isset($_GET['page'])) {
                    $page = $_GET['page'];
                    if(!is_numeric($page)){
                        $page = 1;
                    }
                } else {
                    $page = 1;
                }
                
                if(isset($_GET['codeType'])) {
                    $codeType = $_GET['codeType'];
                    if(!is_numeric($codeType)){
                        $codeType = 1;
                    }
                }else{
                    $codeType = 1;          // color
                }

                $wherequery = null;
                if(isset($_GET["sv"])) {
                    switch ($_GET["st"]) {
                        //case "SIGNUP_ID" : $wherequery = " and a.SIGNUP_ID like \"%".$_GET["sv"]."%\""; break;	// 로그인이메일
						//case "USERNAME" : $wherequery = " and a.USERNAME like \"%".$_GET["sv"]."%\""; break;		// 이름
						//case "ACCOUNT_ID" : $wherequery = " and a.ACCOUNT_ID=".$_GET["sv"].""; break;				// 회원번호
                        default : $wherequery = ""; break;
                    }
                    //$wherequery = " and ".$_GET["st"]."=\"".$_GET["sv"]."\"";
                }
                
                //echo "<br/>".$wherequery;
                /*
                $sql = 'select count(a.ACCOUNT_ID) as cnt
							from account_tb a
							inner join account_leaved_tb alt on a.ACCOUNT_ID = alt.ACCOUNT_ID
							where 1=1'.$wherequery;
                */
                // select CODE_ID,CODE_NAME,CODE_VALUE,CODE_IMAGE from itemcode_tb where CODE_TYPE = 1;
                
                $wherequery .= " and CODE_TYPE = 1";

                $sql = 'select count(CODE_ID) as cnt
                            from ada_item_db.itemcode_tb
                            where 1=1'.$wherequery;
                            
				
                // echo "<br/>".$sql;


				$result = $db->query($sql);
				$row = $result->fetch_assoc();
				$allPost = $row['cnt'];
                $allPage=0;
				$paging = '';
				if($allPost > 0){
					$onePage = 15;
					$allPage = ceil($allPost / $onePage);
					if($page < 1 || ($allPage && $page > $allPage)) {
						?>
						<script>
									alert("존재하지 않는 페이지입니다. <?=$page ?>");
									history.back();
						</script>
						<?php
						exit;
					}

					$oneSection = 10;
					$currentSection = ceil($page / $oneSection);
					$allSection = ceil($allPage / $oneSection);
					$firstPage = ($currentSection * $oneSection) - ($oneSection - 1);
					if($currentSection == $allSection) {
						$lastPage = $allPage;
					} else {
						$lastPage = $currentSection * $oneSection;
					}
					$prevPage = (($currentSection - 1) * $oneSection);
					$nextPage = (($currentSection + 1) * $oneSection) - ($oneSection - 1);
					if($page != 1) {
						$paging .= '
						<li class="paginate_button previous"><a href="javascript:GetReport(1);">처음</a></li>';
					}

					if($currentSection != 1) {
						$paging .= '
						<li class="paginate_button previous"><a href="javascript:GetReport(' . $prevPage . ');"><</a></li>';
					}

					for($i = $firstPage; $i <= $lastPage; $i++) {
						if($i == $page) {
							$paging .= '
							<li class="paginate_button active"><a href="javascript:;"><b>' . $i . '</b></a></li>';
						} else {
							$paging .= '
							<li class="paginate_button"><a href="javascript:GetReport(' . $i . ');">' . $i . '</a></li>';
						}
					}
					if($currentSection != $allSection) {
						$paging .= '
						<li class="paginate_button next"><a href="javascript:GetReport(' . $nextPage . ')">></a></li>';
					}
					if($page != $allPage) {
						$paging .= '
						<li class="paginate_button next"><a href="javascript:GetReport(' . $allPage . ')">마지막</a></li>';
					}
					$currentLimit = ($onePage * $page) - $onePage;
                    $sqlLimit = ' limit ' . $currentLimit . ', ' . $onePage;
                    
                    $sql = 'select CODE_ID,CODE_NAME,CODE_VALUE,CODE_IMAGE 
                                from ada_item_db.itemcode_tb
                                where 1=1 '. $wherequery.'
                                order by CODE_ID desc ' . $sqlLimit;

                    /* 
					$sql = 'select a.ACCOUNT_ID,a.SIGNUP_ID,a.EMAIL,a.USERNAME,a.SIGNUP_PATH,a.PROFILE_IMAGE,a.DELETED,a.REG_DATETIME 
                                from account_tb a 
								inner join account_leaved_tb alt on a.ACCOUNT_ID = alt.ACCOUNT_ID
                                where 1=1 '. $wherequery.'
                                order by a.REG_DATETIME desc ' . $sqlLimit;
                    */
                    //echo "<br/>".$sql;
					$result = $db->query($sql);
				}
				?>
                <div  id="reportList" >
                <section class="panel">
                    <header class="panel-heading">
                                    color-Code List &nbsp;&nbsp;&nbsp;[ <?=$page?>/ <?=$allPage?> ]
                    </header>
                    <table class="table table-striped table-advance table-hover">
                        <tbody>
                            <tr>
                                <th>CODE_ID</th>
                                <th>CODE_NAME</th>
                                <th>CODE_VALUE</th>
                                <th>CODE_IMAGE</th>
                            </tr>
                            <?
                            if($allPost <= 0)
                            {
                                ?>
                                <tr><td align="center" height="300" colspan="7">조회내역이 없습니다.</td></tr>
                                <?
                            }else{
                            while($row = $result->fetch_assoc())
                            {
                                // BRAND_ID, BRAND_NAME, DESCRIPTION, BRAND_URL, BRAND_IMAGE, THUM_IMAGE, GENDER, SORT_ID, STATE 
                            ?>
                            <tr>
                                <td><?=$row['CODE_ID']?></td>
                                <td><?=$row['CODE_NAME']?></td>
                                <td><?=$row['CODE_VALUE']?></td>
                                <td><?=$row['CODE_IMAGE']?></td>
                            </tr>
                            <?
                        }
                        }
                            ?>
                        </tbody>
                    </table>
                </section>

                <!--pagination start-->
                <section class="panel">
                    <div class="panel-body">
                        <div class="text-center">
                            <ul class="pagination">
                                <?=$paging ?>
                            </ul>
                        </div>
                    </div>

				
                </section>
                <!--pagination end-->
                </div>