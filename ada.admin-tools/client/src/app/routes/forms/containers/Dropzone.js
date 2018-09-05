import React                                             from "react"
import {BigBreadcrumbs, JarvisWidget, Stats, WidgetGrid} from "../../../components"
import Datatable                                         from "../../../components/tables/Datatable";
import CustomNetwork                                     from "../../../components/network/CustomNetwork";

export default class Dropzone extends React.Component
{
	constructor(props)
	{
		super(props);

		this.state = {
			version: "",
			description: "",
			uploadInput: []
		};

		this.onSetVersion = this.onSetVersion.bind(this);
		this.onSetDescription = this.onSetDescription.bind(this);
		this.onRequestUploadFile = this.onRequestUploadFile.bind(this);
		this.onWritePreview = this.onWritePreview.bind(this);
	}

	componentDidMount()
	{
		const parents = $('#data-table');

		parents.on("click", "button[id='update']", function ()
		{
			alert("준비 중입니다.");
		});

		parents.on("click", "button[id='delete']", function ()
		{
			const table = parents.DataTable();
			const data = table.row($(this).parents('tr')).data();
			if (confirm(`버전(v.${data.versionCode})을 삭제 하시겠습니까?`)) {

				CustomNetwork.request("delete", "/data/upload/json", {versionCode: data.versionCode}, (response) => {
					if (response.data.state === true) {
						window.location.reload();
					}
					else {
						alert("배포중인 버전 입니다.");
					}
				});
			}
		});
	}

	/**********************************************************************************************************
	 * set
	 **********************************************************************************************************/
	onSetVersion(event)
	{
		this.setState({version: event.target.value});
	}

	onSetDescription(event)
	{
		this.setState({description: event.target.value});
	}

	onWritePreview(event)
	{
		const $parents = $("#preview");
		$parents.empty();

		if (this.uploadInput.files.length > 0) {
			$parents.append("<pre/>");
			const count = this.uploadInput.files.length;
			for (let idx = 0; idx < count; ++idx) {
				const data = this.uploadInput.files[idx];
				$parents.find("pre").append(` Size: ${data.size}Byte, Type: ${data.type}, [ ${data.name} ]\n`);
			}
		}
	}

	/**********************************************************************************************************
	 * network
	 **********************************************************************************************************/
	onRequestUploadFile(event)
	{
		if (this.validation()) {
			event.preventDefault();

			const data = new FormData();
			data.append("versionCode", this.state.version);
			data.append("registrant", "administrator");
			data.append("description", this.state.description);

			const count = this.uploadInput.files.length;
			for (let idx = 0; idx < count; ++idx) {
				data.append("file", this.uploadInput.files[idx]);
			}

			CustomNetwork.request("post", "/data/upload/json", data, (response) => {
				alert(`버전(v.${this.state.version})이 등록 되었습니다.`);
				window.location.reload();
			});
		}
	}

	/**********************************************************************************************************
	 * manage
	 **********************************************************************************************************/
	validation()
	{
		if (this.state.version === "") {
			alert("버전을 입력해 주세요");
			return false;
		}

		if (this.uploadInput.files.length < 1) {
			alert("선택된 데이터가 존재하지 않습니다.");
			return false;
		}

		if (this.state.description === "") {
			alert("해당 버전의 설명을 기입해 주세요.");
			return false;
		}

		return true;
	}

	render()
	{
		return (
			<div id="content">
				<div className="row">
					<BigBreadcrumbs items={["Forms", "Upload"]} icon="fa fa-fw fa-pencil-square-o"
					                className="col-xs-12 col-sm-7 col-md-7 col-lg-4"/>
					{/*<Stats/>*/}
				</div>
				{/* widget grid */}
				<WidgetGrid>
					{/* row */}
					<div className="row">
						{/* NEW WIDGET START */}
						<article className="col-sm-12">
							<p className="alert alert-warning">
								<i className="fa fa-warning fa-fw fa-lg"/><strong>Opps! </strong>
								You may get an error during the upload for this demo. The error will subside once the
								backend portion is properly configured.
							</p>
							<p>
								<span className="label label-warning"> NOTE</span> &nbsp; This plugins works only on
								Latest Chrome, Firefox, Safari, Opera &amp; Internet
								Explorer 10.
							</p>
							{/* Widget ID (each widget will need unique ID)*/}
							<JarvisWidget editbutton={false}>
								<header>
									<span className="widget-icon"> <i className="fa fa-edit"/> </span>
									{/*<h2>Upload file (.json)</h2>*/}
								</header>
								{/* widget div*/}
								<div>
									{/* widget content */}
									<div className="widget-body no-padding">
										<form className="smart-form">
											<header>
												<strong>Upload file (.json)</strong>
											</header>

											<fieldset>
												<section>
													<label className="label">
														<small>1. Data version</small>
													</label>

													<div className="input">
														<input className="form-control" type="text" placeholder="0.0.1" onChange={this.onSetVersion}/>
													</div>
												</section>
												<section>
													<label className="label">
														<small>2. 선택한 파일의 내용으로 JSON 데이터를 등록합니다.</small>
													</label>

													<div className="input input-file">
                                                        <span className="button"><input ref={(ref) =>
                                                        {
	                                                        this.uploadInput = ref;
                                                        }} type="file" id="file" name="file" multiple onChange={this.onWritePreview}/>Browse</span>
														<input type="text" placeholder="Include some files" readOnly/>
													</div>
												</section>
												<section>
													<label className="label">
														<small>3. Description</small>
													</label>

													<div className="input">
														<input className="form-control" type="text" placeholder="..." onChange={this.onSetDescription}/>
													</div>
												</section>
												<section>
													<a className="btn btn-sm btn-labeled btn-success"
													   onClick={this.onRequestUploadFile}>
														<span className="btn-label"><i className="glyphicon glyphicon-ok"/></span>
														Upload
													</a>
												</section>
											</fieldset>
											<fieldset>
												<div id="preview" />
											</fieldset>
										</form>
									</div>
									{/* end widget content */}
								</div>
								{/* end widget div */}
							</JarvisWidget>

							<JarvisWidget editbutton={false} color="blueLight">
								<header>
									<span className="widget-icon"> <i className="fa fa-table"/> </span>
									{/*<h2>Version List </h2>*/}
								</header>
								<div>
									<div className="widget-body no-padding" id="Test">

										<Datatable options={{
											ajax: "http://localhost:8081/data/upload/json",
											columns: [
												{data: "action"},
												{data: "versionCode"},
												{data: "registrant"},
												{data: "description"},
												{data: "registTime"}
											],
											columnDefs: [ {
												targets: 0,
												data: null,
												orderable: false,
												render: (data, type, row, meta) => {
													return "<button class='btn btn-xs btn-default' style='margin-right:5px' id='update'><i class='fa fa-pencil fa-sm'></i></button><button class='btn btn-xs btn-default' id='delete'><i class='fa fa-times fa-sm'></i></button>"
												}
											} ],
											order: [[1, "asc"]]
										}} paginationLength={true} className="table table-striped table-bordered table-condensed smart-form table-hover" id="data-table" width="100%">
											<thead>
											<tr>
												<th style={{width:"55px"}}>Action</th>
												<th data-hide="phone">
													<i className="fa fa-fw fa-cog text-muted hidden-md hidden-sm hidden-xs"/>
													VersionCode
												</th>
												<th data-class="expand">
													<i className="fa fa-fw fa-user text-muted hidden-md hidden-sm hidden-xs"/>
													&nbsp;Registrant
												</th>
												<th data-hide="phone">
													<i className="fa fa-fw fa-text-height text-muted hidden-md hidden-sm hidden-xs"/>
													&nbsp;Description
												</th>
												<th data-hide="phone,tablet">
													<i className="fa fa-fw fa-calendar txt-color-blue hidden-md hidden-sm hidden-xs"/>
													&nbsp;RegistTime
												</th>
											</tr>
											</thead>
										</Datatable>

									</div>
								</div>
							</JarvisWidget>
							{/* end widget */}
						</article>
					</div>
				</WidgetGrid>
			</div>
		)
	}
}