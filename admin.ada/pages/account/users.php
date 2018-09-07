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

                $wherequery = null;
                if(isset($_GET["sv"])) {
                    switch ($_GET["st"]) {
                        case "SIGNUP_ID" : $wherequery = " and ac.SIGNUP_ID like \"%".$_GET["sv"]."%\""; break;	    // SIGNUP_ID
						case "NICKNAME" : $wherequery = " and pt.NICKNAME like \"%".$_GET["sv"]."%\""; break;		// 닉네임
						case "ACCOUNT_ID" : $wherequery = " and ac.ACCOUNT_ID=".$_GET["sv"].""; break;				// 회원번호
                        default : $wherequery = ""; break;
                    }
                    //$wherequery = " and ".$_GET["st"]."=\"".$_GET["sv"]."\"";
                }

                //echo "<br/>".$wherequery;

                $sql = 'SELECT count(ac.ACCOUNT_ID) as cnt
                    FROM ada_account_db.account_tb ac
                    inner join ada_account_db.profile_tb pt on ac.ACCOUNT_ID = pt.ACCOUNT_ID
                    where 1=1'.$wherequery;
                /*
				$sql = 'select count(a.ACCOUNT_ID) as cnt
                            from ada_account_db.account_tb a
                            where 1=1'.$wherequery;
                */
                //echo "<br/>".$sql;
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


                    $sql = 'SELECT ac.ACCOUNT_ID, ac.SIGNUP_PATH, ac.SIGNUP_ID, ac.BLOCK, ac.DELETED, ac.REG_DATETIME 
                        ,pt.NICKNAME
                        ,case when pt.GENDER = 1 then 1 else 2 end as GENDER		-- ,pt.GENDER
                        ,pt.COUNTRY,pt.AGE
                    FROM ada_account_db.account_tb ac
                    inner join ada_account_db.profile_tb pt on ac.ACCOUNT_ID = pt.ACCOUNT_ID
                    where 1=1 '. $wherequery.'
                                order by ac.REG_DATETIME desc ' . $sqlLimit;

                    /*
					$sql = 'select ACCOUNT_ID,SIGNUP_ID,SIGNUP_PATH,BLOCK,DELETED,REG_DATETIME 
                                from ada_account_db.account_tb a 
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
                                    Account List &nbsp;&nbsp;&nbsp;[ <?=$page?>/ <?=$allPage?> ]
                    </header>
                    <table class="table table-striped table-advance table-hover">
                        <tbody>
                            <tr>
                                <th>ACCOUNT_ID</th>
                                <th>NICKNAME</th>
                                <th>SIGNUP_ID</th>
                                <th>SIGNUP_PATH</th>
                                <th>GENDER</th>
                                <th>COUNTRY</th>
                                <th>AGE</th>
                                <th>BLOCK</th>
								<th>DELETED</th>
                                <th>REG_DATETIME</th>
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
                            ?>
                            <tr>
                                <td><?=$row['ACCOUNT_ID']?></td>
                                <td><?=$row['NICKNAME']?></td>
                                <td><?=$row['SIGNUP_ID']?></td>
                                <td><?=$row['SIGNUP_PATH']?></td>
                                <td><?=$row['GENDER']?></td>
                                <td><?=$row['COUNTRY']?></td>
                                <td><?=$row['AGE']?></td>
                                <td><?=$row['BLOCK']?></td>
								<td><?=$row['DELETED']?></td>
								<td><?=$row['REG_DATETIME']?></td>
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