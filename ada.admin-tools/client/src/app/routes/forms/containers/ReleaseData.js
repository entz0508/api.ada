import React          from 'react'
import BigBreadcrumbs from "../../../components/navigation/components/BigBreadcrumbs";
import Stats          from "../../../components/common/Stats";
import WidgetGrid     from "../../../components/widgets/WidgetGrid";
import JarvisWidget   from "../../../components/widgets/JarvisWidget";
import CustomNetwork  from "../../../components/network/CustomNetwork";

export default class ReleaseData extends React.Component
{
	constructor(props)
	{
		super(props);

		this.state = {
			versionList: [],
			releaseVersion: -1
		};

		this.onRequestReleaseVersionList = this.onRequestReleaseVersionList.bind(this);
		this.onRequestVersionList = this.onRequestVersionList.bind(this);
		this.onRequestUpdateReleaseVersion = this.onRequestUpdateReleaseVersion.bind(this);
	}

	componentWillMount()
	{
		this.onRequestReleaseVersionList();
		this.onRequestVersionList();
	}

	/**********************************************************************************************************
	 * network
	 **********************************************************************************************************/
	onRequestReleaseVersionList()
	{
		CustomNetwork.request("get", "/data/release/json/version", {}, (response) => {
			this.setState({releaseVersion: response.data.versionCode});
		});
	}

	onRequestVersionList()
	{
		CustomNetwork.request("get", "/data/upload/json", {}, (response) => {
			this.setState({versionList: response.data.data});
		});
	}

	onRequestUpdateReleaseVersion()
	{
		if (confirm(`[${$("#versionSelect option:selected").text()}]로 배포 하시겠습니까?.`)) {
			const data = new FormData();
			data.append("versionCode", $("#versionSelect").val());

			CustomNetwork.request("put", "/data/release/json/version", data, (response) => {
				alert("배포 되었습니다.");
				window.location.reload();
			});
		}
	}

	render()
	{
		return (
			<div id="content">
				<div className="row">
					<BigBreadcrumbs items={['Forms', 'Release']} icon="fa fa-fw fa-pencil-square-o"
					                className="col-xs-12 col-sm-7 col-md-7 col-lg-4"/>
					{/*<Stats/>*/}
				</div>
				<WidgetGrid>
					<div className="row">
						<article className="col-sm-12">
							{/* Widget ID (each widget will need unique ID)*/}
							<JarvisWidget colorbutton={false} editbutton={false}
							              custombutton={false}>
								<header>
									<span className="widget-icon"> <i className="fa fa-edit"/> </span>
									{/*<h2>Basic Form Elements </h2>*/}
								</header>

								{/* widget div*/}
								<div>
									{/* widget content */}
									<div className="widget-body no-padding">

										<form className="smart-form">
											<header>
												<strong>Release version</strong>
											</header>
											<fieldset>
												<section>
													<label className="label">Current Release Version</label>
													<label className="input">
														<input type="text" className="input-sm" disabled="disabled" value={`Release Version: (${this.state.releaseVersion})`}/>
													</label>
												</section>
												<section>
													<section>
														<label className="label">Select Version</label>
														<label className="select">
															<select className="input-sm" id="versionSelect">
																{this.state.versionList.map((row, index) =>
																{
																	return <option key={row.versionCode}
																	               value={row.versionCode}>Version:(v.{row.versionCode})
																		/ {new Date(row.registTime).toLocaleString()}</option>
																})}
															</select><i/>
														</label>
													</section>
													<div className="note">
														<strong>※</strong> 선택된 데이터 버전으로 배포 합니다.
													</div>
												</section>
												<section>
													<a className="btn btn-sm btn-labeled btn-success"
													   onClick={this.onRequestUpdateReleaseVersion}>
														<span className="btn-label"><i className="glyphicon glyphicon-ok"/></span>
														Release
													</a>
												</section>
											</fieldset>
										</form>
									</div>
								</div>
							</JarvisWidget>
						</article>
					</div>
				</WidgetGrid>
			</div>
		)
	}
}