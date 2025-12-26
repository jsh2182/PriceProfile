function toJSON() {
    let profileInfo = {};
    let inputs = $(".profileInfo").serializeArray();
    $.each(inputs, function () {
        profileInfo[this.name] = this.value;
    })
    profileInfo["ID"] = profileID;
    return JSON.stringify(profileInfo);
}


//class softwareFeatures {
//    constructor() {
//        this.FeatureList = [{ name:"ویژگی 1", type:"نوع 1" }];
//    }
//}
var profileID = 0;
var selectedProfileID = 0;
var selectedBasePrice = 0;
var hardwareList = [{
    ID: 1,
    Title: "RAM",
    Count: 0,
    CountUnit: "GB",
    Speed: 0,
    SpeedUnit: "MHz",
    Description: ""
},
{
    ID: 2,
    Title: "HDD",
    Count: 0,
    CountUnit: "GB",
    Speed: 0,
    SpeedUnit: "Mb/s",
    Description: ""
},
{
    ID: 3,
    Title: "CPU",
    Count: 0,
    CountUnit: "Core",
    Speed: 0,
    SpeedUnit: "MHz",
    Description: ""
},
{
    ID: 4,
    Title: "Network",
    Count: 0,
    CountUnit: "-",
    Speed: 0,
    SpeedUnit: "Mb/s",
    Description: ""
}
]
var softwareList = [{ ID: 1, Description: "" }, { ID: 2, Description: "" }, { ID: 3, Description: "" }, { ID: 4, Description: "" }, { ID: 5, Description: "" }]
function addProfile() {
    if (profileID == 0) {
        $.ajax({
            url: "/PriceProfileService.svc/AddProfile",
            type: "POST",
            contentType: "application/json",
            data: toJSON(),
            success: function (result) {
                if (parseInt(result) > 0) {
                    alert("عملیات با موفقیت انجام شد.");
                    profileID = parseInt(result);
                    $("#fldFeatures").show();
                }
                else {
                    alert("اشکال در انجام عملیات");
                }
            }


        })
    }
    else {
        $.ajax({
            url: "/PriceProfileService.svc/EditProfile",
            type: "PUT",
            contentType: "application/json",
            data: toJSON(),
            success: function (result) {
                if (result == true) {
                    alert("عملیات با موفقیت انجام شد.");
                }
                else {
                    alert("اشکال در انجام عملیات");
                }
            }


        })
    }
}
function deleteProfile() {
    if (profileID == 0 || profileID === undefined)
        return;
    $.ajax({
        url: "/PriceProfileService.svc/DeleteProfile/" + profileID,
        type: "DELETE",
        contentType: "application/json",
        success: function (result) {
            if (result == true) {
                alert("عملیات با موفقیت انجام شد");
                resetForm();
            }
            else {
                alert("اشکال در انجام عملیات");
            }
        }

    })
}
function searchProfile() {
    $.ajax({
        url: "/PriceProfileService.svc/SearchProfile",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ searchParam: $("#searchParam").val(), justContains: true }),
        success: function (result) {
            if (result.SearchProfileResult == null) {
                alert("موردی یافت نشد");
                return;
            }
            profileID = result.SearchProfileResult.ID;
            $("#SoftwareName").val(result.SearchProfileResult.SoftwareName);
            $("#SoftwareDesc").val(result.SearchProfileResult.SoftwareDesc);
            $("#BasePrice").val(result.SearchProfileResult.BasePrice);
            $("#fldFeatures").show();
            $("#gridFeatureList").data("kendoGrid").dataSource.read();
            $("#searchLink").addClass("collapsed");
            $("#searchLink").attr("aria-expanded", false);
            $("#searchPanel").attr("aria-expanded", false);
            $("#searchPanel").removeClass("in");
            $("#searchPanel").css("height", "0px");

        }
    });
}
function showFeatureList() {
    $("#featureList").modal("show");
}
function getProfileID() {
    return { profileID: profileID };
}
function printProfile() {
    var mywindow = window.open('', 'new div', 'height=400,width=600');
    let doc = mywindow.document;
    doc.write('<html><head><title></title>');
    doc.write("<div style='height:100px; max-height:100px;'></div>")
    doc.write("<style> @font-face {font-family: 'Vazirr'; src: url('/Content/fonts/Vazir-FD-WOL.woff') format('woff');font-size:11px;   font-weight: normal;}  table, th, td { border: 1px solid black;} td {padding:5px;} table {border-collapse: collapse; width:100%} @page { size: auto;  margin-top: 0mm; }");
    doc.write("@font-face {font-family: 'Vazirr'; src: url('/Content/fonts/Vazir-Bold-FD-WOL.woff') format('woff');font-size:11px;  font-weight: bold;} </style>");
    doc.write('</head><body style = "direction: rtl; font-family: Vazirr !important;text-align: right; @media:print">');
    doc.write("<fieldset><legend>مشخصات مشتری</legend>")
    doc.write("<div style='width:250px;max-width:250px margin-top:5px; display:inline-block;'><label>نام شرکت/سازمان:</label>")
    doc.write("<label>" + $("#CustomerName").val() + "</label></div>");
    doc.write("<div style='width:250px;max-width:250px margin-top:5px; display:inline-block;'><label>تلفن:</label>");
    doc.write("<label>" + $("#PhoneNumber").val() + "</label></div>");
    doc.write("<div style='style='margin-top:5px;'><label>آدرس:</label>");
    doc.write("<label>" + $("#Address").val() + "</label></div>");
    doc.write("</fieldset>")

    doc.write("<fieldset style='height:770px; max-height:770px;margin-bottom:20px;'><legend>مشخصات نرم افزار درخواستی</legend>");
    doc.write("<div style=' margin-top:5px;margin-bottom:5px; display:inline-block;'><label>شماره سریال نرم افزار:</label>")
    doc.write("<label>" + $("#softwareSerial").val() + "</label></div>");
    let tbl = doc.createElement("table");
    tbl.style = "margin-bottom:10px;"
    let tHeadString = "<tr><th style='width:35%'>امکانات خریداری شده</th><th style='width:10%'>حداکثر</th><th style='width:55%'>شـــــرح</th></tr>";
    let th = $.parseHTML(tHeadString);
    tbl.appendChild(th[0]);
    let rows = $($("#gridSelectedSoftwareFeatures").data('kendoGrid').tbody.find("tr")).clone();
    for (let k = 0; k < rows.length; k++) {
        let checkBox = $(rows[k]).find("td")[0];
        if ($(checkBox.children[0]).prop("checked") == false)
            continue;
        $(checkBox).remove();
        tbl.appendChild(rows[k]);
    }
    doc.write(tbl.outerHTML);
    doc.write($("#divTotalPrice").html().trim());
    doc.write("</fieldset>");
    doc.write("<div style='height:120px; max-height:120px;'></div>")
    doc.write("<fieldset><legend>حداقل سخت افزار مورد نیاز</legend>")

    let tblHardwareList = doc.createElement("table");
    let tHeadString1 = "<tr><th>عنوان</th><th>تعداد/مقدار</th><th>واحد</th><th>سرعت</th><th>واحد</th><th>شـــــرح</th></tr>";
    let th1 = $.parseHTML(tHeadString1);
    tblHardwareList.appendChild(th1[0]);
    rows = $($("#gridHardwareList").data("kendoGrid").tbody.find("tr")).clone();
    for (let k = 0; k < rows.length; k++) {
        tblHardwareList.appendChild(rows[k]);
    }
    doc.write(tblHardwareList.outerHTML);
    doc.write("</fieldset>")
    doc.write("<fieldset style='margin-top:10px;'><legend>نرم افزارهای مورد نیاز</legend>")

    let tblSoftwareList = doc.createElement("table");
    th = $.parseHTML("<tr><th style='width:8%'>ردیف</th><th>نام نرم افزار</th></tr>");
    tblSoftwareList.appendChild(th[0]);
    rows = $($("#gridSoftwareList").data("kendoGrid").tbody.find("tr")).clone();
    for (let k = 0; k < rows.length; k++) {
        tblSoftwareList.appendChild(rows[k]);
    }
    doc.write(tblSoftwareList.outerHTML);
    doc.write("</fieldset>")
    doc.write("<div><p>اينجانب ................................................. به عنوان نماينده شركت/سازمان مذکور، موارد فوق را مطالعه نموده و تاييد مي نمايم شرايط ذکر شده جهت نصب و راه اندازي نرم افزار حضور غیاب تحت وب فراهم مي باشد.</p>")
    doc.write("<p>تاریخ:</p>")
    doc.write("<div style='text-align:left'><p>مهر و امضا</p></div></div>")
    doc.write("<div><p style='font-weight:bold'>تحویل نرم افزار:</p>");
    doc.write("<p>بدینوسیله نرم افزار حضور غیاب تحت وب با مشخصات فوق توسط اینجانب .................................... نصب و راه اندازی شد و به آقای/خانم ............................. به نمایندگی از شرکت مذکور تحویل گردید.</p>")
    doc.write("<p>تاریخ:</p>");
    doc.write("<div style='text-align:left'><p>مهر و امضای تحویل گیرنده</p></div>")
    doc.write('</body></html>');
    mywindow.print();
    mywindow.close();
    return true;

}
function onChange(e) {
    try {
        var grid = $("#gridProfiles").data("kendoGrid");
        let selected = e.sender.select();
        let dataItem = grid.dataItem(selected);
        selectedProfileID = dataItem.ID;
        selectedBasePrice = dataItem.BasePrice;
        $("#finalPrice").text(commaSeparateNumber(dataItem.BasePrice));
        $("#gridSelectedSoftwareFeatures").data("kendoGrid").dataSource.read();
    } catch (e) {
        console.log(e);
    }

}
function calc() {
    if ($(this).prop("checked")) {
        let checked = $(this).is(':checked');
        let grid = $("#gridSelectedSoftwareFeatures").data("kendoGrid");
        let dataItem = grid.dataItem($(this).closest('tr'));
        dataItem.IsSelected = checked;
        dataItem.dirty = true;
    }
    let tdArray = $(this).closest("tr").find("td");
    let n_b = parseFloat(tdArray[7].innerText);
    let a = parseFloat(tdArray[8].innerText);
    let b = parseFloat(tdArray[9].innerText);
    let currentID = parseInt(tdArray[11].innerText);
    let finalPrice = selectedBasePrice;
    if ($(this)[0].type == "text") {
        let n = 0;
        try {
            n = parseInt($(this)[0].value);

        } catch (e) {
            n = 0;
        }
        if (n - n_b > 0)
            finalPrice += a * selectedBasePrice * (n - n_b) + b;
        let data = $("#gridSelectedSoftwareFeatures").data("kendoGrid").dataSource.data();
        for (let k = 0; k < data.length; k++) {
            if (data[k].ID == currentID || ((data[k].FeatureValue == 0 || data[k].FeatureValue == data[k].MinimumLimitation) && data[k].HasLimitation))
                continue;
            if (data[k].IsSelected && data[k].IsCheckType) {
                finalPrice += data[k].Parameter_a * selectedBasePrice + data[k].Parameter_b;
            }
            else if (data[k].HasLimitation) {
                finalPrice += data[k].Parameter_a * selectedBasePrice * (data[k].FeatureValue - data[k].MinimumLimitation) + data[k].Parameter_b;
            }

        }

    }
    else {
        if ($(this).prop("checked") == true)
            finalPrice = parseFloat($("#finalPrice").text().replace(/,/g, "")) + a * selectedBasePrice /** n_b*/ + b;
        else
            finalPrice = parseFloat($("#finalPrice").text().replace(/,/g, "")) - (a * selectedBasePrice /** n_b*/ + b);
    }
    $("#finalPrice").text(commaSeparateNumber(finalPrice));

}
function resetForm() {
    profileID = 0;
    $("#SoftwareName").val("");
    $("#SoftwareDesc").val("");
    $("#BasePrice").val("0");
    $("#gridFeatureList").data("kendoGrid").dataSource.read();
    $("#fldFeatures").hide();
}
function resetPrintForm() {
    $("#gridHardwareList").data("kendoGrid").dataSource.read();
    $("#gridSoftwareList").data("kendoGrid").dataSource.read();
    $("#gridSelectedSoftwareFeatures").data("kendoGrid").dataSource.read();
    $("#finalPrice").text(commaSeparateNumber(selectedBasePrice));
    $("#softwareSerial").val("");
    $("#Address").val("");
    $("#PhoneNumber").val("");
    $("#CustomerName").val("");
}
function commaSeparateNumber(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');

    }
    return val;
}

$(document).ready(() => {
    //dataContext = new softwareFeatures();
    //initGrids();
    let isManager = $("#isManager").val();
    if (isManager == "false") {
        $("#profileTab").removeClass("active");
        $("#profileLink").removeClass("active");
        $("#printTab").addClass("active");
        $("#printLink").addClass("active");

    }
    let ds = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/PriceProfileService.svc/GetFeatures",
                dataType: "json",
                type: "GET",
                data: getProfileID()
            },
            update: {
                url: "/PriceProfileService.svc/EditFeature",
                contentType: "application/json; charset=utf-8",
                type: "PUT",
                dataType: "json"
            },
            destroy: {
                url: function (feature) {
                    return "/PriceProfileService.svc/DeleteFeature/" + feature.models[0].ID
                },
                type: "DELETE",
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            },
            create: {
                url: "/PriceProfileService.svc/AddFeature",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                type: "POST",
                complete: function (result) {
                    $("#gridFeatureList").data("kendoGrid").dataSource.read();
                    //alert(result);
                }
            },

            parameterMap: function (options, operation) {
                if (operation !== "read" && operation !== "destroy" && options.models) {
                    options.models[0].ProfileID = parseInt(profileID);
                    return kendo.stringify(options.models[0]);
                }
                else if (operation == "read")
                    return { profileID: profileID };

            }
        },
        batch: true,
        schema: {
            model: {
                id: "ID",
                fields: {
                    ID: { type: "number", nullable: false },
                    ProfileID: { type: "number", nullable: false },
                    FeatureName: { type: "string" },
                    FeatureDesc: { type: "string" },
                    IsCheckType: { type: "boolean" },
                    HasLimitation: { type: "boolean" },
                    CheckTypeDefaultValue: { type: "boolean" },
                    MinimumLimitation: { type: "number" },
                    Parameter_a: { type: "string" },
                    Parameter_b: { type: "number" }
                }
            }
        }
    });
    $("#gridFeatureList").kendoGrid({
        dataSource: ds,
        toolbar: [{ name: "create", text: "ایجاد" }],
        //sortable: true,
        resizable: true,
        editable: "inline",
        columns: [
            { command: [{ name: "edit", text: { edit: "ویرایش", update: "تایید", cancel: "انصراف" } }, { name: "destroy", text: "حذف" }], title: "&nbsp;", width: "163px" },
            { field: "FeatureName", title: "نام ویژگی", width: '16.5%' },
            { field: "FeatureDesc", title: "شرح ویژگی", width: '21%' },
            {
                field: "IsCheckType", title: "انتخابی است", width: "10%",
                template: '<input type="checkbox" #= IsCheckType ? "checked=checked" : "" # disabled="disabled" ></input>'
            },
            {
                field: "HasLimitation", title: "محدودیتی است", width: "12%",
                template: '<input type="checkbox" #= HasLimitation ? "checked=checked" : "" # disabled="disabled" ></input>'
            },
            {
                field: "CheckTypeDefaultValue", title: "پیش‏فرض انتخاب", width: "12.5%",
                template: '<input type="checkbox" #= CheckTypeDefaultValue ? "checked=checked" : "" # disabled="disabled" ></input>'
            },
            { field: "MinimumLimitation", title: "محدودیت کمینه", width: "12%", },
            { field: "Parameter_a", title: "پارامتر a", width: "7%" },
            { field: "Parameter_b", title: "پارامتر b", width: "7%" },
            { field: "ProfileID", hidden: true }
        ]

    })
    let dsSelectedSoftwareFeatures = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/PriceProfileService.svc/GetFeatures",
                dataType: "json",
                type: "GET"
            },
            parameterMap: function (option, operation) {
                if (operation == "read")
                    return { profileID: selectedProfileID };
            }
        },
        batch: true,
        schema: {
            model: {
                id: "ID",
                fields: {
                    ID: { type: "number", nullable: false, editable: false },
                    ProfileID: { type: "number", nullable: false, editable: false },
                    FeatureName: { type: "string", editable: false },
                    FeatureDesc: { type: "string", editable: false },
                    FeatureValue: { type: "number", editable: true },
                    IsCheckType: { type: "boolean", editable: false },
                    HasLimitation: { type: "boolean", editable: false },
                    CheckTypeDefaultValue: { type: "boolean", editable: false },
                    MinimumLimitation: { type: "number", editable: false },

                    Parameter_a: { type: "number", editable: false },
                    Parameter_b: { type: "number", editable: false },
                    IsSelected: { type: "boolean", editable: true },
                }
            }
        }
    });
    $("#gridSelectedSoftwareFeatures").kendoGrid({
        dataSource: dsSelectedSoftwareFeatures,
        sortable: true,
        resizable: true,
        editable: "incell",
        headerAttributes: {
            style: "width:'100%'"
        },
        columns: [
            {
                title: " ", width: "4%",
                field: "IsSelected",
                template: '<input type="checkbox" onChange="calc.call(this)" #= IsCheckType ? CheckTypeDefaultValue ? "checked=checked" :"" : "checked=checked disabled=disabled" #  ></input>'
            },
            { field: "FeatureName", title: "نام ویژگی", width: "23%" },
            {
                field: "FeatureValue",
                template: "<label style='font-weight:normal'>  #= HasLimitation ? FeatureValue == 0 ? MinimumLimitation : FeatureValue:'---' # </label>",
                title: "محدودیت", width: "8%",
                editor: function (container, options) {
                    if (options.model.HasLimitation == true) {
                        let input = $("<input name='" + options.field + "' onChange='calc.call(this)'/>");
                        $(input).val(options.model.MinimumLimitation);
                        input.appendTo(container);
                        input.kendoNumericTextBox({
                            min: options.model.MinimumLimitation
                        });
                    }
                    else {
                        let label = $("<lebel name='" + options.field + "'>---</label>");
                        label.appendTo(container);
                    }
                }
            },
            { field: "FeatureDesc", title: "شرح ویژگی", width: "65%" },
            {
                field: "IsCheckType", title: "انتخابی است", hidden: true,
                template: '<input type="checkbox" #= IsCheckType ? "checked=checked" : "" # disabled="disabled" ></input>'
            },
            {
                field: "HasLimitation", title: "محدودیتی است", hidden: true,
                template: '<input type="checkbox" #= HasLimitation ? "checked=checked" : "" # disabled="disabled" ></input>'
            },
            {
                field: "CheckTypeDefaultValue", title: "پیش فرض انتخاب", hidden: true,
                template: '<input type="checkbox" #= CheckTypeDefaultValue ? "checked=checked" : "" # disabled="disabled" ></input>'
            },
            { field: "MinimumLimitation", title: "محدودیت کمینه", hidden: true },
            { field: "Parameter_a", title: "پارامتر a", hidden: true },
            { field: "Parameter_b", title: "پارامتر b", hidden: true },
            { field: "ProfileID", hidden: true },
            { field: "ID", hidden: true }
        ]

    })
    let dsProfiles = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/PriceProfileService.svc/GetProfiles",
                dataType: "json",
                type: "GET"
            }
        },
        batch: true,
        schema: {
            model: {
                id: "ID",
                fields: {
                    ID: { type: "number", nullable: false },
                    SoftwareName: { type: "string", nullable: false },
                    SoftwareDesc: { type: "string" },
                    BasePrice: { type: "number" },
                }
            }
        }
    });
    $("#gridProfiles").kendoGrid({
        dataSource: dsProfiles,
        sortable: true,
        selectable: true,
        scrollable: false,
        resizable: true,
        change: onChange,
        columns: [
            { field: "SoftwareName", title: "نام نرم افزار", width: "25%" },
            { field: "BasePrice", title: "قیمت پایه" },
            { field: "SoftwareDesc", title: "شرح نرم افزار", width: "60%" },

            { field: "ID", hidden: true }
        ]

    })
    $("#gridHardwareList").kendoGrid({
        dataSource: {
            data: hardwareList,

        },
        scrollable: false,
        resizable: true,
        editable: "incell",
        columns: [
            { field: "Title", title: "عنوان", width: "25%" },
            { field: "Count", title: "تعداد/مقدار", width: "10%" },
            { field: "CountUnit", title: "واحد", width: "10%" },
            { field: "Speed", title: "سرعت", width: "10%" },
            { field: "SpeedUnit", title: "واحد", width: "10%" },
            { field: "Description", title: "شرح", width: "35%" }
        ]

    })
    $("#gridSoftwareList").kendoGrid({
        dataSource: {
            data: softwareList,

        },
        scrollable: false,
        resizable: true,
        editable: true,
        columns: [
            { field: "ID", title: "ردیف", width: "4%", editable: false },
            { field: "Description", title: "نام نرم افزار", width: "96%" }
        ]

    })
    $(".k-grid-header").css("padding-left", "0px");
    $("#gridHardwareList").on("focus", "td", function (e) {
        $("input").on("keypress", function (event) {
            if (event.keyCode == 13) {
                setTimeout(function () {
                    var grid = $("#gridHardwareList").data("kendoGrid");
                    var curCell = $("#gridHardwareList").find(".k-edit-cell");
                    grid.editCell(curCell.next());

                });

            }
        });
    })
});