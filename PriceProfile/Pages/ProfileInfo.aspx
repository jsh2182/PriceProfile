<%@ Page Language="C#" %>

<%@ Import Namespace="System" %>
<%@ Import Namespace="System.DirectoryServices.AccountManagement" %>
<%@ Import Namespace="System.DirectoryServices" %>


<%  //var domain = new PrincipalContext(ContextType.Domain);
    //var user = UserPrincipal.FindByIdentity(domain, Context.User.Identity.Name);
    //var groups = user.GetAuthorizationGroups();
    var isManager = true;// groups.Any(g => g.Name.ToLower() == "managers");
%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <script src="../Scripts/jquery-min-v3.4.1.js"></script>
    <script src="../Scripts/bootstrap.min-3.4.1.js"></script>
    <script src="../Scripts/PriceProfile/ProfileInfo.js"></script>

    <link href="../Content/bootstrap.min-3.4.1.css" rel="stylesheet" />
    <link href="../Content/style.css" rel="stylesheet" />
    <link href="../Content/kendo.default.min.css" rel="stylesheet" />
    <link href="../Content/kendo.common.min.css" rel="stylesheet" />
    <link href="../Content/kendo.rtl.min.css" rel="stylesheet" />
    <link href="../Content/Site.css" rel="stylesheet" />
    <script src="../Scripts/PriceProfile/kendo.all.min.js"></script>
    <title></title>
</head>
<body>
    <%if (isManager)
        {%>
    <input type="hidden" id="isManager" value="true" />
    <%}
        else
        { %>
    <input type="hidden" id="isManager" value="false" />
    <%} %>
    <div class="container">
        <div class="panel panel-primary">
            <div class="panel-heading">
                <h4>پروفایل تعیین قیمت</h4>
            </div>
            <div class="panel-body">
                <div class="col-xs-11" style="padding-left: 0px;">
                    <div class="tab-content">
                        <%if (isManager)
                            {%>
                        <div class="tab-pane active" id="profileTab">
                            <div class="panel panel-info">
                                <div class="panel-heading">
                                    <h5>تعریف/ویرایش پروفایل</h5>
                                </div>
                                <div class="panel-body">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">
                                            <div class="panel-title">
                                                <a data-toggle="collapse" id="searchLink" href="#searchPanel">جستجو</a>
                                            </div>
                                        </div>
                                        <div class="panel-collapse collapse" id="searchPanel">
                                            <div class="row" style="margin-right: 5px; margin-top: 5px;">
                                                <div class="col-md-4">
                                                    <label>نام/شرح نرم افزار</label>
                                                    <input type="text" id="searchParam" class="form-control" />
                                                </div>
                                                <div class="col-md-3" style="margin-top: 24px; padding-right: 0px;">
                                                    <label></label>
                                                    <button type="button" id="btnSearch" class="btn btn-success" onclick="searchProfile()">جستجو</button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div class="row divBorder">
                                        <div class="row" style="margin-right: 5px;">
                                            <div class="col-md-3 colMargin">
                                                <label>نام نرم افزار:</label>
                                                <input type="text" id="SoftwareName" name="SoftwareName" class="form-control profileInfo" />
                                            </div>
                                            <div class="col-md-3">
                                                <label>شرح نرم افزار:</label>
                                                <input type="text" id="SoftwareDesc" name="SoftwareDesc" class="form-control profileInfo" />
                                            </div>
                                            <div class="col-md-3">
                                                <label>قیمت پایه:</label>
                                                <input type="number" id="BasePrice" name="BasePrice" value="0" min="0" class="form-control profileInfo" />
                                            </div>
                                        </div>
                                        <div class="row" style="margin: 5px;">
                                            <div class="col-md-6">
                                                <button type="button" class="btn btn-success" onclick="addProfile()">ثبت</button>
                                                <button type="button" class="btn btn-danger" onclick="resetForm()">انصراف/بازنشانی فرم</button>
                                                <button type="button" class="btn btn-danger" onclick="deleteProfile()">حذف پروفایل</button>
                                            </div>
                                        </div>
                                    </div>
                                    <fieldset id="fldFeatures" style="display: none;">
                                        <legend>ویژگی های نرم افزار</legend>
                                        <div class="k-rtl" style="margin: 4px; overflow: auto">
                                            <div id="gridFeatureList"></div>
                                        </div>
                                    </fieldset>

                                </div>
                            </div>
                        </div>
                        <%} %>
                        <div class="tab-pane" id="printTab">
                            <div class="tab-content">
                                <div class="panel panel-info">
                                    <div class="panel-heading">
                                        <h5>چاپ لیست قیمت</h5>
                                    </div>
                                    <div class="panel-body">
                                        <div class="k-rtl noPrint" style="margin: 4px; overflow: auto">
                                            <div id="gridProfiles"></div>
                                        </div>
                                        <div class="row" id="printArea" style="margin-right: 5px; margin-left: 5px;">
                                            <fieldset>
                                                <legend>مشخصات مشتری</legend>
                                                <div class="row" style="margin-right: 5px;">
                                                    <div class="col-md-4">
                                                        <label>نام شرکت/سازمان</label>
                                                        <input type="text" id="CustomerName" class="form-control" />
                                                    </div>
                                                    <div class="col-md-3">
                                                        <label>تلفن</label>
                                                        <input type="text" id="PhoneNumber" class="form-control" />
                                                    </div>
                                                    <div class="col-md-7">
                                                        <label>آدرس</label>
                                                        <input type="text" id="Address" class="form-control" />
                                                    </div>
                                                </div>
                                            </fieldset>
                                            <fieldset>
                                                <legend>مشخصات نرم افزار درخواستی</legend>
                                                <div class="row" style="margin-right: 5px;">
                                                    <div class="col-md-4">
                                                        <label>شماره سریال نرم افزار</label>
                                                        <input type="text" id="softwareSerial" class="form-control" />
                                                    </div>
                                                </div>
                                                <div class="k-rtl" style="margin: 4px; overflow: auto">
                                                    <div id="gridSelectedSoftwareFeatures"></div>
                                                </div>
                                                <div class="row" id="divTotalPrice" style="margin-right: 5px;">
                                                    <div class="col-md-4">
                                                        <label>قیمت تمام شده:</label>
                                                        <label id="finalPrice" style="color: maroon">0</label>
                                                    </div>
                                                </div>
                                            </fieldset>
                                            <fieldset>
                                                <legend>حداقل سخت افزار مورد نیاز</legend>
                                                <div class="k-rtl" style="margin: 4px; width: 70%; overflow: auto">
                                                    <div id="gridHardwareList"></div>
                                                </div>
                                            </fieldset>
                                            <fieldset>
                                                <legend>نرم افزارهای مورد نیاز</legend>
                                                <div class="k-rtl" style="margin: 4px; width: 50%; overflow: auto">
                                                    <div id="gridSoftwareList"></div>
                                                </div>
                                            </fieldset>
                                        </div>
                                        <div class="row" style="margin-right: 5px;">
                                            <button type="button" class="btn btn-success" onclick="printProfile('divPrintProfile')">چاپ اطلاعات</button>
                                            <button type="button" class="btn btn-danger" onclick="resetPrintForm()">بارگذاری دوباره</button>
                                        </div>
                                        <div id="divPrintProfile"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xs-1" style="margin: 0px; padding: 0px;">
                    <ul class="nav nav-tabs tabs-right sideways">
                        <%if (isManager)
                            {%>
                        <li id="profileLink" class="active"><a href="#profileTab" data-toggle="tab" style="padding-right: 5px; padding-left: 0px;">تعریف پروفایل</a></li>
                        <% }%>
                        <li id="printLink"><a href="#printTab" data-toggle="tab">فرم چاپ</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
