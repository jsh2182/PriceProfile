
var dataGridTableObjArray = [];
var dataContext;
let PalizGrid = function (dataSource, grid) {

    this.DataSource = dataSource;
    buildAndFillDatagrid.call(this, grid);


    function Edit(parentRow) {
        let parentTable = $(parentRow).closest("table");
        if ($(parentTable).find('tr[ineditmode="true"]').length > 0) {
            alert("you have unsaved row!");
            return;
        }
        let accBtn = $(parentRow).find(".acceptBtn")[0];
        $(accBtn).css("display", "inline");
        let editBtn = $(parentRow).find(".editBtn")[0];
        $(editBtn).css("display", "none");
        $(parentRow).find("input").attr("disabled", false);
        $(parentRow).attr("inEditMode", "true");
    }

    function Accept(obj) {
        let parentRow = this.rowObj;
        var editBtn = $(obj).siblings(".editBtn")[0];

        let parentTable = parentRow;
        let tagName = $(parentTable).prop("tagName").toLowerCase();
        while (tagName != "table" && tagName != "body") {
            parentTable = $(parentTable).parent();
            tagName = $(parentTable).prop("tagName").toLowerCase();
        }

        if (tagName == "table") {

            let firstName = $(parentRow).find('[data-bind="content:FirstName"]');
            firstName = $(firstName[0]).val();
            let lastName = $(parentRow).find('[data-bind="content:LastName"]');
            lastName = $(lastName[0]).val();
            let personnelCode = $(parentRow).find('[data-bind="content:PersonnelCode"]');
            personnelCode = $(personnelCode[0]).val();
            let isActive = $(parentRow).find('[data-bind="content:IsActive"]');
            isActive = $(isActive[0]).prop("checked");
            let birthDate = $(parentRow).find('[data-bind="content:BirthDate"]');
            birthDate = $(birthDate[0]).val();

            let isValid = true;
            let relatedTag, propVal, res;
            let headersToValidate = $(parentTable).find('th[validate="true"]');
            if (headersToValidate) {

                for (let i = 0; i < headersToValidate.length; i++) {

                    let dataBindAttr = $(headersToValidate[i]).attr("data-bind");
                    let type = $(headersToValidate[i]).attr("type");
                    if (type) {

                        switch (type) {
                            case "string":
                            case "text":
                                relatedTag = $(parentRow).find('[data-bind="' + dataBindAttr + '"]');
                                propVal = $(relatedTag[0]).val();
                                res = ValidateString(relatedTag[0], propVal);
                                if (!res) {
                                    isValid = false;
                                }
                                break;
                            case "number":
                                relatedTag = $(parentRow).find('[data-bind="' + dataBindAttr + '"]');
                                propVal = $(relatedTag[0]).val();
                                res = ValidateNumber(relatedTag[0], propVal);
                                if (!res) {
                                    isValid = false;
                                }
                                break;
                            case "date":
                                relatedTag = $(parentRow).find('[data-bind="' + dataBindAttr + '"]');
                                propVal = $(relatedTag[0]).val();
                                let typeOfDate = $(headersToValidate[i]).attr("typeOfDate");
                                res = ValidateDate(relatedTag[0], propVal, typeOfDate);
                                if (!res) {
                                    isValid = false;
                                }
                                break
                        }
                    }
                }
            }
            if (isValid == true) {
                $(editBtn).css("display", "inline");
                $(obj).css("display", "none");
                $(parentRow).find("input").attr("disabled", true);
                $(parentRow).attr("inEditMode", "false");
                this.FirstName = firstName;
                this.LastName = lastName;
                this.PersonnelCode = personnelCode;
                this.IsActive = isActive;
                this.BirthDate = birthDate;
                $(parentRow).removeAttr("unsavedNewRow");
            }
        }

    }

    function Delete(parentRow) {
        let inEditMode = $(parentRow).attr("inEditMode");
        let isUnsavedNewRow = $(parentRow).attr("unsavedNewRow");

        if (isUnsavedNewRow || !inEditMode || inEditMode == "false") {

            let parentTable = $(parentRow).closest("table");

                if (isUnsavedNewRow) {
                    $(parentRow).remove();
                    let newArr = [];
                    for (let i = 0; i < personnelArray.length; i++) {
                        if (personnelArray[i].rowObj != this.rowObj) {
                            newArr.push(personnelArray[i]);
                        }
                    }
                    personnelArray = newArr;
                }
                else {
                    if ($(parentTable).find('tr[ineditmode="true"]').length > 0) {
                        alert("you have unsaved row!");
                    }
                    else {
                        if (confirm("are you sure?")) {
                            $(parentRow).remove();
                            let newArr = [];
                            for (let i = 0; i < personnelArray.length; i++) {
                                if (personnelArray[i].rowObj != this.rowObj) {
                                    newArr.push(personnelArray[i]);
                                }
                            }

                            personnelArray = newArr;
                        }
                        else {
                            console.log("canceled!");
                        }
                    }
                }
            
        }
        else if (inEditMode && inEditMode == "true") {

            let acceptBtn = $(obj).find(".acceptBtn")[0];
            let editBtn = $(obj).find(".editBtn")[0];
            $(editBtn).css("display", "inline");
            $(acceptBtn).css("display", "none");
            $(parentRow).find("input").attr("disabled", true);
            $(parentRow).attr("inEditMode", "false");

            //restore values
            //let firstName = $(parentRow).find('[data-bind="content:FirstName"]');
            //$(firstName[0]).val(this.FirstName);

            //let lastName = $(parentRow).find('[data-bind="content:LastName"]');
            //$(lastName[0]).val(this.LastName);

            //let isActive = $(parentRow).find('[data-bind="content:IsActive"]');
            //$(isActive[0]).prop("checked", this.IsActive);

            let tooltip = $(parentRow).find(".invalid-input-tooltip");
            if (tooltip && tooltip.length > 0) {
                $(tooltip).css("opacity", "0");
            }
            $(parentRow).find(".invalid").removeClass("invalid");
        }
    }

    function TableClass(table, datagrid, dataSource) {

        this.Table = table;
        this.Datagrid = datagrid;
        this.DataSource = dataSource;


        function AddRow() {

            let dataSource = this.DataSource;
            let editableDataGrid = this.Datagrid;
            let table = this.Table;

            if ($(table).find('tr[ineditmode="true"]').length > 0) {
                alert("you have unsaved row!");
            }
            else {

                var columns = $(editableDataGrid).find("column");

                var row = '<tr>';
                row += '<td class="stickyTd"><div class="btnDivBackground">' +
                    ' <button class="delBtn WBbutton" onclick="DeleteRow(this)"><span class="icon-x-button"></span></button>' +
                    ' <button class="editBtn  WBbutton" onclick="EditRow(this)" style="display:none;"><span class="icon-pencil"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span><span class="path13"></span><span class="path14"></span><span class="path15"></span></span></button>' +
                    ' <button class="acceptBtn WBbutton" onclick="AcceptRow(this)" style="font-size:22px;"><span class="icon-check"></span></button>' +
                    '</div></td>';

                if (columns && columns.length > 0) {
                    for (i = 0; i < columns.length; i++) {
                        let dataToBeInserted = "";
                        var dBindAttr = "";
                        var innerHtml = columns[i].innerHTML;
                        if (innerHtml.trim().length > 0) {
                            var newTag = innerHtml.toString().trim();
                            newTag = $.parseHTML(newTag);
                            var tempDiv = document.createElement("div");
                            tempDiv.append(newTag[0]);
                            dataToBeInserted = tempDiv.innerHTML;
                        }
                        else {
                            dataToBeInserted = "";
                            dBindAttr = $(columns[i]).attr("data-bind");
                        }

                        var hideColumn = $(columns[i]).attr("hide");
                        if (hideColumn !== undefined) {
                            var tdTmp = "<td style='display:none;'>" + dataToBeInserted + "</td>";
                            if (tdTmp.toLowerCase().indexOf("data-bind") < 0) {
                                var tdTmp = $.parseHTML(tdTmp);
                                $(tdTmp[0]).attr("data-bind", "content:" + dBindAttr);
                                tdTmp = tdTmp[0].outerHTML;
                            }
                            row += tdTmp;

                        }
                        else {
                            var tdTmp = "<td>" + dataToBeInserted + "</td>";
                            if (tdTmp.toLowerCase().indexOf("data-bind") < 0) {
                                var tdTmp = $.parseHTML(tdTmp);
                                $(tdTmp[0]).attr("data-bind", "content:" + dBindAttr);
                                tdTmp = tdTmp[0].outerHTML;
                            }
                            row += tdTmp;
                        }
                    }
                }

                row += "</tr>";
                var tbody = $(table).children("tbody");
                var trObj = $.parseHTML(row);
                let newPerson = new Personnel(null, null, null, null);
                newPerson.rowObj = trObj[0];
                newPerson.visibility = [];
                dataSource.push(newPerson);
                $(trObj).attr("role", "tableRow");
                $(trObj).attr("unsavedNewRow", "true");
                $(trObj).attr("inEditMode", "true");
                tbody.append(trObj);
            }
        }

        function FilterHandler(relatedTH, relatedModal) {
            let dataSource = this.DataSource;
            let modalBody = $(relatedModal).find(".modal-body");
            let type = $(relatedTH).attr("type");
            let bindingAttr = $(relatedTH).attr("data-bind");
            let binding = "";
            if (bindingAttr) {
                let inx = bindingAttr.toLowerCase().indexOf("content:")
                if (inx > -1) {
                    inx += 8;
                    while (inx < bindingAttr.length && bindingAttr[inx] != ';') {
                        binding += bindingAttr[inx];
                        inx++;
                    }
                }

            }
            binding = binding.trim();

            let inputs, inputVal, selectedIndex, selectTags, firstInput, secondInput;

            if (type) {
                type = type.toLowerCase();
                switch (type) {
                    case "string":
                        inputs = $(modalBody).find("input[type=text]");
                        selectTags = $(modalBody).find("select");
                        inputVal = $(inputs[0]).val();
                        selectedIndex = $(selectTags[0]).prop("selectedIndex");
                        if (binding.length > 0) {
                            switch (selectedIndex) {
                                case 1:
                                    let temp = "^" + inputVal;
                                    inputVal = temp;
                                    break;
                                case 2:
                                    inputVal += "$";
                                    break;
                            }
                        }
                        StringDataArraySearch(dataSource, binding, inputVal);
                        break;
                    case "number":
                        selectTags = $(modalBody).find("select");
                        selectedIndex = $(selectTags[0]).prop("selectedIndex");
                        inputs = $(modalBody).find("input[type=text]");
                        firstInput = $(inputs[0]).val();
                        secondInput = $(inputs[1]).val();
                        NumberDataArraySearch(dataSource, binding, firstInput, secondInput, selectedIndex);
                        break;
                    case "boolean":
                        inputs = $(modalBody).find("input[type=checkbox]");
                        let trueCheckBox = $(inputs[0]).prop("checked");
                        let falseCheckBox = $(inputs[1]).prop("checked");
                        BooleanDataArraySearch(dataSource, binding, trueCheckBox, falseCheckBox);
                        break;
                    case "date":
                        selectTags = $(modalBody).find("select");
                        selectedIndex = $(selectTags[0]).prop("selectedIndex");
                        inputs = $(modalBody).find("input[type=text]");
                        firstInput = $(inputs[0]).val();
                        secondInput = $(inputs[1]).val();
                        DateDataArraySearch(dataSource, binding, firstInput, secondInput, selectedIndex);
                        break;
                    //case "combobox":
                    //    selectTags = $(modalBody).find("select");
                    //    selectedIndex = $(selectTags[0]).prop("selectedIndex");
                    //    //console.log(selectedIndex);
                    //    break;
                }
            }

            for (let i = 0; i < dataSource.length; i++) {
                $(dataSource[i].rowObj).css("display", "table-row");
                if (dataSource[i].visibility) {
                    for (let j in dataSource[i].visibility) {
                        if (dataSource[i].visibility[j] == false) {
                            $(dataSource[i].rowObj).css("display", "none");
                        }
                    }
                }
            }

            $(relatedModal).css("display", "none");
        }

        function ClearFilter(relatedTH, relatedModal) {

            let type = $(relatedTH).attr("type");
            let bindingAttr = $(relatedTH).attr("data-bind");

            let modalBody = $(relatedModal).find(".modal-body");

            let inputs = null;
            let selectTags = null;
            if (type) {
                type = type.toLowerCase();
                switch (type) {
                    case "string":
                    case "text":
                        inputs = $(modalBody).find("input[type=text]");
                        $(inputs).val('');
                        selectTags = $(modalBody).find("select");
                        $(selectTags).prop("selectedIndex", 0);
                        $(selectTags).change();
                        break;
                    case "number":
                        inputs = $(modalBody).find("input[type=text]");
                        $(inputs).val('');
                        selectTags = $(modalBody).find("select");
                        $(selectTags).prop("selectedIndex", 0);
                        $(selectTags).change();

                        break;
                    case "boolean":
                        inputs = $(modalBody).find("input[type=checkbox]");
                        $(inputs).prop("checked", false);
                        $(inputs).val("false");
                        $(inputs).attr("checked", false);
                        break;
                    case "combobox":
                    case "select":
                        selectTags = $(modalBody).find("select");
                        $(selectTags).prop("selectedIndex", 0);
                        $(selectTags).change();

                        let options = $(selectTags[0]).children("option");
                        let selectedOption = options[0];
                        let optText = $(selectedOption).text();
                        let labelTag = $(selectTags[0]).siblings(".selectedItem");
                        $(labelTag[0]).text("...");
                        break;
                    case "date":
                        inputs = $(modalBody).find("input[type=text]");
                        $(inputs).val('');
                        selectTags = $(modalBody).find("select");
                        $(selectTags).prop("selectedIndex", 0);
                        $(selectTags).change();
                        break;
                }
            }
        }
    }
    function checkSortableTables() {

        var sortableTables = $('table[sortable="true"]');
        if (sortableTables && sortableTables.length > 0) {

            for (i = 0; i < sortableTables.length; i++) {

                var table = sortableTables[i];
                var colHeaders = $(table).find("th");
                $(document).on("click", "th", function () {

                    var sortType = $(this).attr("sortType");
                    if (!sortType || sortType == "Desc") {
                        $(this).attr("sortType", "Asc");
                        sortTable($(this).index(), "Asc", table);
                    }
                    else {
                        $(this).attr("sortType", "Desc");
                        sortTable($(this).index(), "Desc", table);
                    }
                });
            }
        }
    }


    function checkFilterableTableColumns() {

        if (document.dir == "rtl") {
            $(":root").get(0).style.setProperty("--modal-footer-dir", "row");
        }

        var filterableTables = $('table[filterable="true"]');
        if (filterableTables && filterableTables.length > 0) {
            for (i = 0; i < filterableTables.length; i++) {

                $(filterableTables[i]).css("position", "relative");

                //adding filter button
                var filterableCols = $(filterableTables[i]).find('th[filterable="true"]');
                if (filterableCols && filterableCols.length > 0) {
                    for (j = 0; j < filterableCols.length; j++) {

                        var filterBtn = $('<button class="filterBtn WBbutton" onclick="filterBtnClicked(event,this)" style="font-size:12px;"><span class="icon-filter2"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></span></button>');
                        $(filterableCols[j]).find(".headerContent").append(filterBtn);
                    }
                }

                let cols = $(filterableTables[i]).find("th");
                for (let j = 0; j < cols.length; j++) {

                    let isFilterable = $(cols[j]).attr("filterable");
                    if (isFilterable && isFilterable.toLowerCase() == "true") {
                        let htmlCnt = '<div class="modal">' +
                            '<div class="modal-content">' +
                            '<div style="position:relative;">' +
                            '<div class="content">' +
                            '<div><button class="modalCloseBtn WBbutton icon-close" style="font-size:16px;margin:3px;"></button></div>' +
                            '<div class="modal-body">' +
                            '</div>' +
                            '<div class="modal-footer">' +
                            '<button class="applyFilter" onclick="applyFilterClicked(event,this)">' +
                            '<div style="display:flex;flex-direction:row;align-items:center;justify-content:center">' +
                            '<span style="margin:0px 2px;">Apply</span>' +
                            '<span class="icon-filter"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span>' +
                            '</div>' +
                            '</button>' +
                            '<button class="clearFilter" onclick="clearFilterClicked(event,this)">' +
                            '<div style="display:flex;flex-direction:row;align-items:center;justify-content:center">' +
                            '<span style="margin:0px 2px;">Clear</span>' +
                            '<span class="icon-rubbish"></span>' +
                            '</div>' +
                            '</button></div></div>' +
                            '<img class="modal-BG" src="/Images/filter3.svg"/>' +
                            '</div>' +
                            '</div></div>';
                        htmlCnt = $(htmlCnt);
                        let innerHtml = $('<div style="display:flex;flex-direction:column;justify-content:right;padding:1px;"></div>');

                        let type = $(cols[j]).attr("type");
                        let bindingAttr = $(cols[j]).attr("data-bind");

                        if (type) {
                            type = type.toLowerCase();
                            switch (type) {
                                case "string":
                                case "text":
                                    $(innerHtml).append('<select class="testInput2"><option>Contains</option><option>Start with</option><option>Ends with</option></select>');
                                    $(innerHtml).append('<input type="text" class="testInput2" />');
                                    break;
                                case "number":
                                    $(innerHtml).append('<select class="testInput2"><option>Equals</option><option>Greater than</option><option>Greater than or equal</option><option>Smaller than</option><option>Smaller than or equal</option><option>Between</option></select>');
                                    $(innerHtml).append('<input type="text" class="from testInput2"/><label class="to betweenOption" style="font-size:13px;">And</label><input type="text" class="to betweenOption testInput2"/>');
                                    break;
                                case "boolean":
                                    $(innerHtml).append('<span><input type="checkbox" onclick="checkboxOnClick(event,this)" /><label>False</label><input type="checkbox" onclick="checkboxOnClick(event,this)" /><label>True</label></span>');
                                    break;
                                case "combobox":
                                    $(innerHtml).append('<select class="testInput2" onchange="selectionChanged(this)"><option> </option><option>Option1</option><option>Option2</option><option>Option3</option><option>Option4</option></select>');
                                    $(innerHtml).append('<label class="selectedItem">...</label>');
                                    break;
                                case "date":
                                    $(innerHtml).append('<select class="testInput2"><option>Equals</option><option>Greater than</option><option>Smaller than</option><option>Between</option></select>');
                                    $(innerHtml).append('<input type="text" class="from testInput2" /> <label class="to betweenOption" style="font-size:13px;">And</label> <input type="text" class="to betweenOption testInput2" style="width:100%;" />');
                                    break;
                            }
                        }
                        //add to parent table
                        let modalBody = $(htmlCnt).find(".modal-body");
                        $(modalBody[0]).html(innerHtml);
                        if (bindingAttr) {
                            $(htmlCnt).attr("data-bind", bindingAttr);
                        }
                        $(filterableTables[i]).append(htmlCnt);

                        let modal = htmlCnt[0];
                        $(modal).click(function (event) {
                            if (event.target == modal) {
                                modal.style.display = "none";
                            }
                        });

                        let modalCloseBtn = $(htmlCnt).find(".modalCloseBtn");
                        $(modalCloseBtn[0]).click(function () {
                            let modalParent = this;
                            let isModalParent = $(modalParent).hasClass("modal");
                            while (!isModalParent && $(modalParent).prop("tagName").toLowerCase() != "body") {
                                modalParent = $(modalParent).parent();
                                isModalParent = $(modalParent).hasClass("modal");
                            }
                            if (isModalParent) {
                                $(modalParent).css("display", "none");
                            }
                        });

                        if (type == "number" || type == "date") {
                            let selectElement = $(modal).find("select");
                            $(selectElement).change(function (obj2) {
                                obj2 = obj2.target;
                                let selectedIndex = $(obj2).prop("selectedIndex");
                                let options = $(obj2).children();
                                // console.log($(options[selectedIndex]).text());

                                if ($(options[selectedIndex]).text().toLowerCase() == "between") {
                                    let betweenOptionTags = $(obj2).parent().find(".betweenOption").css("display", "inline");
                                }
                                else {
                                    $(obj2).parent().find(".betweenOption").css("display", "none");
                                }

                                let parentModal = obj2;
                                let isModal = $(parentModal).hasClass("modal");
                                while (!isModal && $(parentModal).prop("tagName").toLowerCase() != "body") {
                                    parentModal = $(parentModal).parent();
                                    isModal = $(parentModal).hasClass("modal");
                                }

                                let parentTable = obj2;
                                let isTable = $(parentTable).prop("tagName").toLowerCase() == "table";

                                while (!isTable && $(parentTable).prop("tagName").toLowerCase() != "body") {
                                    parentTable = $(parentTable).parent();
                                    isTable = $(parentTable).prop("tagName").toLowerCase() == "table";
                                }

                                if (isModal) {
                                    let modalContent = $(parentModal[0]).find(".modal-content");

                                    if (isTable) {
                                        tableLeft = $(parentTable[0]).offset().left;
                                        tableWidth = $(parentTable[0]).width();
                                        tableRight = screen.width - (tableLeft + tableWidth);

                                        let headerLeft = $(cols[j]).offset().left;
                                        let headerWidth = $(cols[j]).width();

                                        let x = (headerLeft + headerWidth) - tableLeft;

                                        modalContentWidth = modalContent[0].offsetWidth;

                                        if (x > modalContentWidth) {
                                            //place from right side of the column
                                            $(modalContent[0]).css("left", ((headerLeft + headerWidth) - modalContentWidth) + "px");
                                            $(":root").get(0).style.setProperty("--modal-left", "75%");

                                        } else {
                                            //place from left side
                                            $(modalContent[0]).css("left", (headerLeft) + "px");
                                            $(":root").get(0).style.setProperty("--modal-left", "25%");
                                        }


                                        setTimeout(n => {
                                            modalContentWidth = modalContent[0].offsetWidth;
                                            if (x > modalContentWidth) {
                                                //place from right side of the column
                                                $(modalContent[0]).css("left", ((headerLeft + headerWidth) - modalContentWidth) + "px");
                                                $(":root").get(0).style.setProperty("--modal-left", "75%");

                                            } else {
                                                //place from left side
                                                $(modalContent[0]).css("left", (headerLeft) + "px");
                                                $(":root").get(0).style.setProperty("--modal-left", "25%");
                                            }

                                        }, 5);

                                        //$(modalContent[0]).css("left", tableLeft + ((tableWidth - modalContentWidth) / 2) + "px");
                                        //setTimeout(n => {
                                        //    modalContentWidth = modalContent[0].offsetWidth;
                                        //    $(modalContent[0]).css("left", tableLeft + ((tableWidth - modalContentWidth) / 2) + "px");

                                        //}, 5);
                                    }
                                }
                            });
                        }
                    }
                }
            }
        }
    }

    //sort columns
    function sortTable(colIndex, sortType, table) {
        if (!colIndex || colIndex == 0) {
            return;
        }

        let inEditModeRows = $(table).find('tr[ineditmode="true"]');
        if (inEditModeRows && inEditModeRows.length > 0) {
            alert("you have unsaved row");
            return;
        }

        var colHeaders = $(table).find("th");
        for (j = 1; j < colHeaders.length; j++) {
            var col = $(colHeaders[j]).find("span.sortSpan");
            if (col.length == 0) {
                //$(colHeaders[j]).find(".headerContent").prepend('<span class="sortArrow"><span class="icon-sort-arrows"></span></span>');
            }
            else {
                $(colHeaders[j]).find(".headerContent").find("span.sortSpan").html('<span style="margin:0px 4px;"></span>');
            }
        }

        var thead = $(table).find("thead");
        var thArray = $(thead).find("th");
        if (sortType == "Asc") {
            $(thArray[colIndex]).find(".headerContent").find("span.sortSpan").html('<span class="icon-sort-down"></span>');
        }
        else if (sortType == "Desc") {
            $(thArray[colIndex]).find(".headerContent").find("span.sortSpan").html('<span class="icon-sort-up"></span>');
        }

        let rows, switching, i, x, y, shouldSwitch;
        switching = true;
        while (switching) {
            switching = false;
            rows = $(table).find("tr");
            for (i = 1; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                x = rows[i]
                    .getElementsByTagName("TD")[colIndex]
                    .querySelectorAll("[data-bind]")[0].
                    value.toLowerCase();
                y = rows[i + 1]
                    .getElementsByTagName("TD")[colIndex]
                    .querySelectorAll("[data-bind]")[0]
                    .value.toLowerCase();
                if (y) {
                    if (sortType == "Asc") {
                        if (x > y) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                    else {
                        if (x < y) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                }
            }
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
            }
        }
    }

    //making resizable columns
    function resizableGrid(table) {
        var row = table.getElementsByTagName('tr')[0],
            cols = row ? row.children : undefined;
        if (!cols) return;

        for (var i = 1; i < cols.length; i++) {
            var div = createDiv(table.offsetHeight);
            var parDiv = document.createElement("div");
            $(parDiv).addClass("resizerParentDiv");
            $(div).addClass("resizerChildDiv");
            $(cols[i]).prepend(parDiv);
            parDiv.appendChild(div);
            parDiv.style.position = 'relative';
            setListeners(div);
        }
    }
    function AddRow(self) {

        var parentTable = self;
        var tagName = $(parentTable).prop("tagName").toLowerCase();

        while (tagName != "table" && tagName != "body") {
            parentTable = $(parentTable).parent();
            tagName = $(parentTable).prop("tagName").toLowerCase();
        }

        if (tagName == "table") {
            for (key in dataGridTableObjArray) {
                if ((dataGridTableObjArray[key]).Table == parentTable[0]) {
                    (dataGridTableObjArray[key]).AddRow();
                }
            }
        }
    }


    function DeleteRow() {

        let parentRow = $(this).closest("tr");
        let roleAttr = $(parentRow).attr('role');
        let isTableRow = (roleAttr && roleAttr.toLowerCase() == "tablerow") ? true : false;

        while (!isTableRow && $(parentRow).prop("tagName").toLowerCase() != "body") {
            parentRow = $(parentRow).parent();
            roleAttr = $(parentRow).attr('role');
            isTableRow = (roleAttr && roleAttr.toLowerCase() == "tablerow") ? true : false;
        }

        let parentTable = $(parentRow).closest("table");
        for (key in dataGridTableObjArray) {
            if ((dataGridTableObjArray[key]).Table == parentTable[0]) {
                if (isTableRow) {
                    var resultObj = GetObjectInstanceFromTableRow(parentRow[0], (dataGridTableObjArray[key]).DataSource);
                    if (resultObj) {
                        Delete(parentRow);
                    }
                    else {
                        console.log("row object not found");
                    }
                }
                break;
            }
        }

    };


    function EditRow() {
        let parentRow = $(this).closest("tr");
        let roleAttr = $(parentRow).attr('role');
        let isTableRow = (roleAttr && roleAttr.toLowerCase() == "tablerow") ? true : false;

        while (!isTableRow && $(parentRow).prop("tagName").toLowerCase() != "body") {
            parentRow = $(parentRow).parent();
            roleAttr = $(parentRow).attr('role');
            isTableRow = (roleAttr && roleAttr.toLowerCase() == "tablerow") ? true : false;
        }

        let parentTable = $(parentRow).closest("table");
        if (parentTable === undefined) {
            return;
        }
        for (key in dataGridTableObjArray) {
            if ((dataGridTableObjArray[key]).Table == parentTable[0]) {
                if (isTableRow) {
                    var resultObj = GetObjectInstanceFromTableRow(parentRow[0], dataGridTableObjArray[key].DataSource);

                    if (resultObj) {
                        Edit(parentRow);
                    }
                    else {
                        console.log("row object not found");
                    }
                }
                break;
            }
        }
    }



    function AcceptRow(self) {
        var parentRow = self;
        var roleAttr = $(parentRow).attr('role');
        var isTableRow = (roleAttr && roleAttr.toLowerCase() == "tablerow") ? true : false;

        while (!isTableRow && $(parentRow).prop("tagName").toLowerCase() != "body") {
            parentRow = $(parentRow).parent();
            roleAttr = $(parentRow).attr('role');
            isTableRow = (roleAttr && roleAttr.toLowerCase() == "tablerow") ? true : false;
        }

        let parentTable = parentRow;
        let tagName = $(parentTable).prop("tagName").toLowerCase();
        while (tagName != "table" && tagName != "body") {
            parentTable = $(parentTable).parent();
            tagName = $(parentTable).prop("tagName").toLowerCase();
        }

        if (tagName == "table") {
            for (key in dataGridTableObjArray) {
                if ((dataGridTableObjArray[key]).Table == parentTable[0]) {
                    if (isTableRow) {
                        var resultObj = GetObjectInstanceFromTableRow(parentRow[0], (dataGridTableObjArray[key]).DataSource);
                        if (resultObj) {
                            resultObj.Accept(self);
                        }
                        else {
                            console.log("row object not found");
                        }
                    }
                    break;
                }
            }
        }
    }


    function filterBtnClicked(e, obj) {

        e.stopPropagation();

        let parentTH = obj;
        let isObjHeader = $(parentTH).prop("tagName").toLowerCase() == "th";

        while (!isObjHeader && $(parentTH).prop("tagName").toLowerCase() != "body") {
            parentTH = $(parentTH).parent();
            isObjHeader = $(parentTH).prop("tagName").toLowerCase() == "th";
        }

        if (isObjHeader) {

            let parentTable = parentTH;
            let isTable = $(parentTable).prop("tagName").toLowerCase() == "table";

            while (!isTable && $(parentTable).prop("tagName").toLowerCase() != "body") {
                parentTable = $(parentTable).parent();
                isTable = $(parentTable).prop("tagName").toLowerCase() == "table";
            }

            if (isTable) {

                let inEditModeRows = $(parentTable).find('tr[ineditmode="true"]');
                if (inEditModeRows && inEditModeRows.length > 0) {
                    alert("you have unsaved row");
                    return;
                }

                let dataBindAttr = $(parentTH).attr("data-bind");
                let modal = $(parentTable).find('.modal[data-bind= "' + dataBindAttr + '"]');
                let modalContent = $(modal).find(".modal-content");

                let parentThTop = $(parentTH).offset().top;
                let parentThHeight = $(parentTH).height();
                $(modalContent[0]).css("top", (parentThTop + parentThHeight + 1) + "px");
                $(modal).css("display", "block");

                let tableLeft = $(parentTable).offset().left;
                let modalContentWidth = modalContent[0].clientWidth;

                let headerLeft = $(parentTH).offset().left;
                let headerWidth = $(parentTH).width();

                let x = (headerLeft + headerWidth) - tableLeft;

                if (x > modalContentWidth) {
                    //place from right side of the column
                    $(modalContent[0]).css("left", ((headerLeft + headerWidth) - modalContentWidth) + "px");
                    $(":root").get(0).style.setProperty("--modal-left", "75%");

                } else {
                    //place from left side
                    $(modalContent[0]).css("left", (headerLeft) + "px");
                    $(":root").get(0).style.setProperty("--modal-left", "25%");
                }
            }
        }
    }


    function applyFilterClicked(e, obj) {

        let parentModal = obj;
        let isModalParent = $(parentModal).hasClass("modal");

        while (!isModalParent && $(parentModal).prop("tagName").toLowerCase() != "body") {

            parentModal = $(parentModal).parent();
            isModalParent = $(parentModal).hasClass("modal");
        }

        if (isModalParent) {

            let dataBindAttr = $(parentModal).attr("data-bind");
            let parentTable = $(parentModal);
            let tagName = $(parentTable).prop("tagName").toLowerCase();

            while (tagName != "table" && tagName != "body") {

                parentTable = $(parentTable).parent();
                tagName = $(parentTable).prop("tagName").toLowerCase();
            }

            if (tagName == "table") {

                let relatedTH = $(parentTable).find('th[data-bind="' + dataBindAttr + '"]');
                for (key in dataGridTableObjArray) {

                    if ((dataGridTableObjArray[key]).Table == parentTable[0]) {
                        (dataGridTableObjArray[key]).FilterHandler(relatedTH[0], parentModal[0]);
                    }
                }
            }
        }
    }


    function clearFilterClicked(e, obj) {

        let parentModal = obj;
        let isModalParent = $(parentModal).hasClass("modal");

        while (!isModalParent && $(parentModal).prop("tagName").toLowerCase() != "body") {

            parentModal = $(parentModal).parent();
            isModalParent = $(parentModal).hasClass("modal");
        }

        if (isModalParent) {

            let dataBindAttr = $(parentModal).attr("data-bind");
            let parentTable = $(parentModal);
            let tagName = $(parentTable).prop("tagName").toLowerCase();

            while (tagName != "table" && tagName != "body") {

                parentTable = $(parentTable).parent();
                tagName = $(parentTable).prop("tagName").toLowerCase();
            }

            if (tagName == "table") {

                let relatedTH = $(parentTable).find('th[data-bind="' + dataBindAttr + '"]');


                for (key in dataGridTableObjArray) {

                    if ((dataGridTableObjArray[key]).Table == parentTable[0]) {
                        (dataGridTableObjArray[key]).ClearFilter(relatedTH[0], parentModal[0]);
                    }
                }
            }
        }
    }


    function checkboxOnClick(e, obj) {

        let isChecked = $(obj).prop("checked");
        if (isChecked) {
            $(obj).attr("checked", "checked");
            $(obj).val("true");
        }
        else {
            $(obj).attr("checked", false);
            $(obj).val("false");
        }
    }


    function selectionChanged(obj) {
        let selectedIndex = $(obj).prop("selectedIndex");
        let options = $(obj).children("option");
        let selectedOption = options[selectedIndex];
        let optText = $(selectedOption).text();

        let labelTag = $(obj).siblings(".selectedItem");
        $(labelTag[0]).text(optText);

    }


    function buildAndFillDatagrid(dataGridTag) {

        var mainParent = $(dataGridTag).parent();
        var columns = $(dataGridTag).find("column");
        var mTable = $.parseHTML('<table><thead><tr></tr></thead><tbody></tbody></table>');

        let bindingAttr = $(dataGridTag).attr("data-bind");

        let binding = "";
        if (bindingAttr) {
            if (bindingAttr.indexOf("SourceItems:") > -1) {
                binding = bindingAttr.split(":")[1];
            }
        }
        let arr = this.DataSource;
        let newDatagridTableObj = new TableClass(mTable[0], dataGridTag, arr);

        dataGridTableObjArray.push(newDatagridTableObj);

        $(mTable).attr("data-bind", bindingAttr);
        $(mTable).attr("role", "dataGrid");
        var isSortable = $(dataGridTag).attr("sortable");
        if (isSortable == "true") {
            $(mTable).attr("sortable", "true");
        }
        var isResizable = $(dataGridTag).attr("isResizable");
        if (isResizable == "true") {
            $(mTable).attr("isResizable", "true");
        }
        var isFilterable = $(dataGridTag).attr("filterable");
        if (isFilterable == "true") {
            $(mTable).attr("filterable", "true");
        }
        var verticalBorder = $(dataGridTag).attr("vertical-border");
        if (verticalBorder == "true") {
            $(mTable).addClass("withVerticalBorders");
        }
        var horizontalBorder = $(dataGridTag).attr("horizontal-border");
        if (horizontalBorder == "true") {
            $(mTable).addClass("withHorizontalBorders");
        }

        var footerContent = $(dataGridTag).find("footer");
        if (footerContent && $(footerContent).length > 0) {
            var footerTxt = $(footerContent).html().toString().replace("trdiv", "tr");
            footerTxt = footerTxt.replace("tddiv", "td");
            $(mTable).append('<tfoot>' + footerTxt + '</tfoot>');
            footer = $(mTable).find('tfoot');
            var tds = $(footer).find("td");
            if (tds && tds.length > 0) {
                for (j = 0; j < tds.length; j++) {
                    $(tds[j]).addClass("stickyFooter");
                }
            }
        }

        $(mainParent).append(mTable);

        var thead = $(mTable).find("thead");
        var theadTr = $(thead).find("tr");
        theadTr.append('<th class="buttonColumn stickyTh"><button class="addBtn WBbutton" onclick="AddRow(this)" style="font-size:24px;"><span class="icon-plus"></span></button ></th>');

        for (var i = 0; i < columns.length; i++) {
            var dataBindAttr = $(columns[i]).attr("data-bind");
            if (!dataBindAttr) {
                dataBindAttr = $(columns[i]).find("[data-bind]").attr("data-bind");
            }
            var hideColumn = $(columns[i]).attr("hide");
            let header = "";
            if (hideColumn !== undefined) {
                header = '<th style="display: none; "><div class="headerContent">' + $(columns[i]).attr("header") + "</div></th>";
            }
            else {
                header = '<th class="stickyTh"><div class="headerContent"><span class="sortSpan"></span><p class="titleSpan">' + $(columns[i]).attr("header") + "</p></div></th>";
            }
            header = $(header);
            $(header).attr("data-bind", dataBindAttr);
            let filterable = $(columns[i]).attr("filterable");
            if (filterable !== undefined) {
                type = $(columns[i]).attr("type");
                if (type) {
                    //if (filterable !== undefined) {
                    $(header).attr("filterable", "true");
                    //}
                    $(header).attr("type", type);
                }
            }
            let validateCol = $(columns[i]).attr("validate");
            if (validateCol) {
                let type = $(columns[i]).attr("type");
                $(header).attr("validate", validateCol);
                $(header).attr("type", type);

                if (type && type == "date") {
                    let typeOfDate = $(columns[i]).attr("typeOfDate");
                    $(header).attr("typeOfDate", typeOfDate);
                }
            }

            let invalidInputMessage = $(columns[i]).attr("invalid-input-message");
            if (invalidInputMessage) {
                $(header).attr("invalid-input-message", invalidInputMessage);
            }

            theadTr.append(header);
        }

        var datagridClasses = $(dataGridTag).attr("class");
        if (datagridClasses && datagridClasses.trim().length > 0) {
            $(mTable).addClass(datagridClasses);
        }

        fillTableRows(dataGridTag, this.DataSource);

        $(dataGridTag).css("display", "none");
    }


    function fillTableRows(dataGridTag, dataList) {

        if (dataGridTag) {

            var table = null;
            for (key in dataGridTableObjArray) {
                if ((dataGridTableObjArray[key]).Datagrid == dataGridTag) {
                    table = (dataGridTableObjArray[key]).Table;
                }
            }

            if (table) {

                var tbody = $(table).find("tbody");
                for (i = 0; i < dataList.length; i++) {
                    let dataRow = dataList[i];
                    let tableRow = document.createElement("tr");
                    let tableCol = document.createElement("td");
                    tableCol.className = "stickyTd";
                    tableCol.innerHTML =
                        '<div class="btnDivBackground">' +
                        ' <button class="delBtn WBbutton""><span class="icon-x-button"></span></button>' +
                        ' <button class="editBtn WBbutton"><span class="icon-pencil"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span><span class="path13"></span><span class="path14"></span><span class="path15"></span></span></button>' +
                        ' <button class="acceptBtn WBbutton" onclick="AcceptRow(this)" style="display:none;font-size:22px;"><span class="icon-check"></span></button>' +
                        '</div>';
                    let editBtn = tableCol.querySelectorAll(".editBtn.WBbutton");
                    $(editBtn).on("click", function () {
                        EditRow.call(this);
                    })
                    let delBtn = tableCol.querySelectorAll(".delBtn.WBbutton");
                    $(delBtn).on("click", function () {
                        DeleteRow.call(this);
                    })
                    tableRow.append(tableCol);

                    for (key in dataRow) {

                        let tags = $(dataGridTag).find('[data-bind="content:' + key + '"]');
                        if (tags && tags.length > 0) {
                            let dataTag = $(tags[0]);
                            isColumn = (dataTag.prop("tagName").toLowerCase() == "column");
                            while (!isColumn && dataTag.prop("tagName").toLowerCase() != "body") {
                                dataTag = dataTag.parent();
                                isColumn = (dataTag.prop("tagName").toLowerCase() == "column");
                            }
                            let tdEl = document.createElement("td");
                            if (!isColumn) { continue; }

                            if (dataTag[0].innerHTML.trim().length > 0) {
                                tdEl.innerHTML = dataTag[0].innerHTML.trim();
                                let innerEl = tdEl.querySelectorAll('[data-bind="content:' + key + '"]');
                                innerEl[0].value = dataRow[key];
                                if ($(innerEl).is("input"))
                                    $(innerEl).addClass("testInput");
                            }
                            else {
                                let input;
                                let inputType = dataTag.attr("type").replace("string", "text");
                                if (inputType == "select") {
                                    input = document.createElement("select");
                                    continue;
                                }
                                input = document.createElement("input");
                                input.setAttribute("type", inputType);
                                input.className = "testInput";
                                input.value = dataRow[key];
                                input.setAttribute("data-bind", "content:" + key);
                                if (inputType == "checkbox")
                                    input.setAttribute("checked", dataRow[key]);
                                tdEl.append(input);
                            }
                            if ($(dataTag).attr("hide") !== undefined) {
                                tdEl.style.display = "none";
                            }
                            tableRow.append(tdEl);
                        }
                    }
                    dataList[i].rowObj = tableRow;// trObj[0];
                    dataList[i].visibility = [];

                    $(tableRow).attr("role", "tableRow");
                    tbody.append(tableRow);

                    var inputs = $(tableRow).find("input");
                    $(inputs).prop("disabled", true);
                }
            }
        }
    }


    function checkResizableTables() {

        var resizableTables = $('table[isResizable="true"]');
        if (resizableTables && resizableTables.length > 0) {

            for (i = 0; i < resizableTables.length; i++) {
                resizableGrid(resizableTables[i]);
            }
        }
    }


    function checkSortableTables() {

        var sortableTables = $('table[sortable="true"]');
        if (sortableTables && sortableTables.length > 0) {

            for (i = 0; i < sortableTables.length; i++) {

                var table = sortableTables[i];
                var colHeaders = $(table).find("th");
                $(document).on("click", "th", function () {

                    var sortType = $(this).attr("sortType");
                    if (!sortType || sortType == "Desc") {
                        $(this).attr("sortType", "Asc");
                        sortTable($(this).index(), "Asc", table);
                    }
                    else {
                        $(this).attr("sortType", "Desc");
                        sortTable($(this).index(), "Desc", table);
                    }
                });
            }
        }
    }


    function checkFilterableTableColumns() {

        if (document.dir == "rtl") {
            $(":root").get(0).style.setProperty("--modal-footer-dir", "row");
        }

        var filterableTables = $('table[filterable="true"]');
        if (filterableTables && filterableTables.length > 0) {
            for (i = 0; i < filterableTables.length; i++) {

                $(filterableTables[i]).css("position", "relative");

                //adding filter button
                var filterableCols = $(filterableTables[i]).find('th[filterable="true"]');
                if (filterableCols && filterableCols.length > 0) {
                    for (j = 0; j < filterableCols.length; j++) {

                        var filterBtn = $('<button class="filterBtn WBbutton" onclick="filterBtnClicked(event,this)" style="font-size:12px;"><span class="icon-filter2"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></span></button>');
                        $(filterableCols[j]).find(".headerContent").append(filterBtn);
                    }
                }

                let cols = $(filterableTables[i]).find("th");
                for (let j = 0; j < cols.length; j++) {

                    let isFilterable = $(cols[j]).attr("filterable");
                    if (isFilterable && isFilterable.toLowerCase() == "true") {
                        let htmlCnt = '<div class="modal">' +
                            '<div class="modal-content">' +
                            '<div style="position:relative;">' +
                            '<div class="content">' +
                            '<div><button class="modalCloseBtn WBbutton icon-close" style="font-size:16px;margin:3px;"></button></div>' +
                            '<div class="modal-body">' +
                            '</div>' +
                            '<div class="modal-footer">' +
                            '<button class="applyFilter" onclick="applyFilterClicked(event,this)">' +
                            '<div style="display:flex;flex-direction:row;align-items:center;justify-content:center">' +
                            '<span style="margin:0px 2px;">Apply</span>' +
                            '<span class="icon-filter"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span>' +
                            '</div>' +
                            '</button>' +
                            '<button class="clearFilter" onclick="clearFilterClicked(event,this)">' +
                            '<div style="display:flex;flex-direction:row;align-items:center;justify-content:center">' +
                            '<span style="margin:0px 2px;">Clear</span>' +
                            '<span class="icon-rubbish"></span>' +
                            '</div>' +
                            '</button></div></div>' +
                            '<img class="modal-BG" src="/Images/filter3.svg"/>' +
                            '</div>' +
                            '</div></div>';
                        htmlCnt = $(htmlCnt);
                        let innerHtml = $('<div style="display:flex;flex-direction:column;justify-content:right;padding:1px;"></div>');

                        let type = $(cols[j]).attr("type");
                        let bindingAttr = $(cols[j]).attr("data-bind");

                        if (type) {
                            type = type.toLowerCase();
                            switch (type) {
                                case "string":
                                case "text":
                                    $(innerHtml).append('<select class="testInput2"><option>Contains</option><option>Start with</option><option>Ends with</option></select>');
                                    $(innerHtml).append('<input type="text" class="testInput2" />');
                                    break;
                                case "number":
                                    $(innerHtml).append('<select class="testInput2"><option>Equals</option><option>Greater than</option><option>Greater than or equal</option><option>Smaller than</option><option>Smaller than or equal</option><option>Between</option></select>');
                                    $(innerHtml).append('<input type="text" class="from testInput2"/><label class="to betweenOption" style="font-size:13px;">And</label><input type="text" class="to betweenOption testInput2"/>');
                                    break;
                                case "boolean":
                                    $(innerHtml).append('<span><input type="checkbox" onclick="checkboxOnClick(event,this)" /><label>False</label><input type="checkbox" onclick="checkboxOnClick(event,this)" /><label>True</label></span>');
                                    break;
                                case "combobox":
                                    $(innerHtml).append('<select class="testInput2" onchange="selectionChanged(this)"><option> </option><option>Option1</option><option>Option2</option><option>Option3</option><option>Option4</option></select>');
                                    $(innerHtml).append('<label class="selectedItem">...</label>');
                                    break;
                                case "date":
                                    $(innerHtml).append('<select class="testInput2"><option>Equals</option><option>Greater than</option><option>Smaller than</option><option>Between</option></select>');
                                    $(innerHtml).append('<input type="text" class="from testInput2" /> <label class="to betweenOption" style="font-size:13px;">And</label> <input type="text" class="to betweenOption testInput2" style="width:100%;" />');
                                    break;
                            }
                        }
                        //add to parent table
                        let modalBody = $(htmlCnt).find(".modal-body");
                        $(modalBody[0]).html(innerHtml);
                        if (bindingAttr) {
                            $(htmlCnt).attr("data-bind", bindingAttr);
                        }
                        $(filterableTables[i]).append(htmlCnt);

                        let modal = htmlCnt[0];
                        $(modal).click(function (event) {
                            if (event.target == modal) {
                                modal.style.display = "none";
                            }
                        });

                        let modalCloseBtn = $(htmlCnt).find(".modalCloseBtn");
                        $(modalCloseBtn[0]).click(function () {
                            let modalParent = this;
                            let isModalParent = $(modalParent).hasClass("modal");
                            while (!isModalParent && $(modalParent).prop("tagName").toLowerCase() != "body") {
                                modalParent = $(modalParent).parent();
                                isModalParent = $(modalParent).hasClass("modal");
                            }
                            if (isModalParent) {
                                $(modalParent).css("display", "none");
                            }
                        });

                        if (type == "number" || type == "date") {
                            let selectElement = $(modal).find("select");
                            $(selectElement).change(function (obj2) {
                                obj2 = obj2.target;
                                let selectedIndex = $(obj2).prop("selectedIndex");
                                let options = $(obj2).children();
                                // console.log($(options[selectedIndex]).text());

                                if ($(options[selectedIndex]).text().toLowerCase() == "between") {
                                    let betweenOptionTags = $(obj2).parent().find(".betweenOption").css("display", "inline");
                                }
                                else {
                                    $(obj2).parent().find(".betweenOption").css("display", "none");
                                }

                                let parentModal = obj2;
                                let isModal = $(parentModal).hasClass("modal");
                                while (!isModal && $(parentModal).prop("tagName").toLowerCase() != "body") {
                                    parentModal = $(parentModal).parent();
                                    isModal = $(parentModal).hasClass("modal");
                                }

                                let parentTable = obj2;
                                let isTable = $(parentTable).prop("tagName").toLowerCase() == "table";

                                while (!isTable && $(parentTable).prop("tagName").toLowerCase() != "body") {
                                    parentTable = $(parentTable).parent();
                                    isTable = $(parentTable).prop("tagName").toLowerCase() == "table";
                                }

                                if (isModal) {
                                    let modalContent = $(parentModal[0]).find(".modal-content");

                                    if (isTable) {
                                        tableLeft = $(parentTable[0]).offset().left;
                                        tableWidth = $(parentTable[0]).width();
                                        tableRight = screen.width - (tableLeft + tableWidth);

                                        let headerLeft = $(cols[j]).offset().left;
                                        let headerWidth = $(cols[j]).width();

                                        let x = (headerLeft + headerWidth) - tableLeft;

                                        modalContentWidth = modalContent[0].offsetWidth;

                                        if (x > modalContentWidth) {
                                            //place from right side of the column
                                            $(modalContent[0]).css("left", ((headerLeft + headerWidth) - modalContentWidth) + "px");
                                            $(":root").get(0).style.setProperty("--modal-left", "75%");

                                        } else {
                                            //place from left side
                                            $(modalContent[0]).css("left", (headerLeft) + "px");
                                            $(":root").get(0).style.setProperty("--modal-left", "25%");
                                        }


                                        setTimeout(n => {
                                            modalContentWidth = modalContent[0].offsetWidth;
                                            if (x > modalContentWidth) {
                                                //place from right side of the column
                                                $(modalContent[0]).css("left", ((headerLeft + headerWidth) - modalContentWidth) + "px");
                                                $(":root").get(0).style.setProperty("--modal-left", "75%");

                                            } else {
                                                //place from left side
                                                $(modalContent[0]).css("left", (headerLeft) + "px");
                                                $(":root").get(0).style.setProperty("--modal-left", "25%");
                                            }

                                        }, 5);

                                    }
                                }
                            });
                        }
                    }
                }
            }
        }
    }

    //sort columns
    function sortTable(colIndex, sortType, table) {
        if (!colIndex || colIndex == 0) {
            return;
        }

        let inEditModeRows = $(table).find('tr[ineditmode="true"]');
        if (inEditModeRows && inEditModeRows.length > 0) {
            alert("you have unsaved row");
            return;
        }

        var colHeaders = $(table).find("th");
        for (j = 1; j < colHeaders.length; j++) {
            var col = $(colHeaders[j]).find("span.sortSpan");
            if (col.length == 0) {
                //$(colHeaders[j]).find(".headerContent").prepend('<span class="sortArrow"><span class="icon-sort-arrows"></span></span>');
            }
            else {
                $(colHeaders[j]).find(".headerContent").find("span.sortSpan").html('<span style="margin:0px 4px;"></span>');
            }
        }

        var thead = $(table).find("thead");
        var thArray = $(thead).find("th");
        if (sortType == "Asc") {
            $(thArray[colIndex]).find(".headerContent").find("span.sortSpan").html('<span class="icon-sort-down"></span>');
        }
        else if (sortType == "Desc") {
            $(thArray[colIndex]).find(".headerContent").find("span.sortSpan").html('<span class="icon-sort-up"></span>');
        }

        let rows, switching, i, x, y, shouldSwitch;
        switching = true;
        while (switching) {
            switching = false;
            rows = $(table).find("tr");
            for (i = 1; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                x = rows[i]
                    .getElementsByTagName("TD")[colIndex]
                    .querySelectorAll("[data-bind]")[0].
                    value.toLowerCase();
                y = rows[i + 1]
                    .getElementsByTagName("TD")[colIndex]
                    .querySelectorAll("[data-bind]")[0]
                    .value.toLowerCase();
                if (y) {
                    if (sortType == "Asc") {
                        if (x > y) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                    else {
                        if (x < y) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                }
            }
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
            }
        }
    }

    //making resizable columns
    function resizableGrid(table) {
        var row = table.getElementsByTagName('tr')[0],
            cols = row ? row.children : undefined;
        if (!cols) return;

        for (var i = 1; i < cols.length; i++) {
            var div = createDiv(table.offsetHeight);
            var parDiv = document.createElement("div");
            $(parDiv).addClass("resizerParentDiv");
            $(div).addClass("resizerChildDiv");
            $(cols[i]).prepend(parDiv);
            parDiv.appendChild(div);
            parDiv.style.position = 'relative';
            setListeners(div);
        }
    }

    function createDiv(height) {
        var div = document.createElement('div');
        div.style.top = 0;
        if (document.dir == "rtl") {
            div.style.left = 0;
        }
        else {
            div.style.right = 0;
        }

        div.style.width = '5px';
        div.style.position = 'absolute';
        div.style.cursor = 'col-resize';
        //div.style.backgroundColor = 'red';
        div.style.userSelect = 'none';
        div.style.height = height + 'px';
        return div;
    }

    function setListeners(div) {
        var pageX, curCol, nxtCol, curColWidth, nxtColWidth;
        div.addEventListener('mousedown', function (e) {
            e.stopPropagation();
            divPar = e.target.parentElement;
            curCol = divPar.parentElement;
            nxtCol = curCol.nextElementSibling;
            pageX = e.pageX;
            curColWidth = curCol.offsetWidth
            if (nxtCol)
                nxtColWidth = nxtCol.offsetWidth

        });

        document.addEventListener('mousemove', function (e) {
            e.stopPropagation();
            if (curCol) {
                if (document.dir == "rtl") {
                    var diffX = pageX - e.pageX;//for dir:Rtl
                }
                else {
                    var diffX = e.pageX - pageX; //for dir:Ltr
                }

                if (diffX > 0 && nxtCol)
                    nxtCol.style.width = (nxtColWidth - (diffX)) + 'px';

                curCol.style.width = (curColWidth + diffX) + 'px';
            }
        });

        document.addEventListener('mouseup', function (e) {
            e.stopPropagation();
            curCol = undefined;
            nxtCol = undefined;
            pageX = undefined;
            nxtColWidth = undefined;
            curColWidth = undefined;
        });

        div.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

    function GetObjectInstanceFromTableRow(rowObj, dataArray) {
        result = null;
        if (dataArray && dataArray.length > 0) {

            for (i = 0; i < dataArray.length; i++) {
                if (dataArray[i].rowObj == rowObj) {
                    result = dataArray[i];
                    break;
                }
            }
        }
        return result;
    }

    function StringDataArraySearch(sourceArray, propName, propVal) {

        if (sourceArray && sourceArray.length > 0) {
            let searchStr = new RegExp(propVal, "i");
            for (let i = 0; i < sourceArray.length; i++) {
                if (((sourceArray[i][propName]).search(searchStr)) > -1) {
                    sourceArray[i].visibility[propName] = true;
                }
                else {
                    sourceArray[i].visibility[propName] = false;
                }
            }
        }
    }

    function NumberDataArraySearch(sourceArray, propName, fromNumber, toNumber, conditionInx) {

        if (sourceArray && sourceArray.length > 0) {

            if (fromNumber || toNumber) {
                switch (conditionInx) {
                    case 0:
                        for (let i = 0; i < sourceArray.length; i++) {
                            sourceArray[i].visibility[propName] = sourceArray[i][propName] == fromNumber;
                        }
                        break;
                    case 1:
                        for (let i = 0; i < sourceArray.length; i++) {
                            sourceArray[i].visibility[propName] = sourceArray[i][propName] > fromNumber;
                        }
                        break;
                    case 2:
                        for (let i = 0; i < sourceArray.length; i++) {
                            sourceArray[i].visibility[propName] = sourceArray[i][propName] >= fromNumber;
                        }
                        break;
                    case 3:
                        for (let i = 0; i < sourceArray.length; i++) {
                            sourceArray[i].visibility[propName] = sourceArray[i][propName] < fromNumber;
                        }
                        break;
                    case 4:
                        for (let i = 0; i < sourceArray.length; i++) {
                            sourceArray[i].visibility[propName] = sourceArray[i][propName] <= fromNumber;
                        }
                        break;
                    case 5:
                        for (let i = 0; i < sourceArray.length; i++) {
                            sourceArray[i].visibility[propName] = (sourceArray[i][propName] > fromNumber) && (sourceArray[i][propName] < toNumber);
                        }
                        break;
                }
            }
            else {
                for (let i = 0; i < sourceArray.length; i++) {
                    sourceArray[i].visibility[propName] = true;
                }
            }
        }
    }

    function BooleanDataArraySearch(sourceArray, propName, trueCheckbox, falseCheckbox) {

        if (!sourceArray || sourceArray.length == 0) {
            return;
        }

        if ((trueCheckbox && falseCheckbox) || (!trueCheckbox && !falseCheckbox)) {
            for (let i = 0; i < sourceArray.length; i++) {
                sourceArray[i].visibility[propName] = true;
            }
        }
        else if (trueCheckbox) {
            for (let i = 0; i < sourceArray.length; i++) {
                sourceArray[i].visibility[propName] = sourceArray[i][propName] == true;
            }
        }
        else {
            for (let i = 0; i < sourceArray.length; i++) {
                sourceArray[i].visibility[propName] = sourceArray[i][propName] == false;
            }
        }

    }

    function DateDataArraySearch(sourceArray, propName, fromDate, toDate, conditionInx) {

        if (sourceArray && sourceArray.length > 0) {

            if (fromDate || toDate) {
                let date1 = new Date(fromDate).getTime();
                let date2 = new Date(toDate);
                switch (conditionInx) {
                    case 0:
                        for (let i = 0; i < sourceArray.length; i++) {
                            let tempDate = new Date(sourceArray[i][propName]).getTime();
                            if (tempDate == date1) {
                                sourceArray[i].visibility[propName] = true;
                            }
                            else {
                                sourceArray[i].visibility[propName] = false;
                            }
                        }
                        break;
                    case 1:
                        for (let i = 0; i < sourceArray.length; i++) {
                            let tempDate = new Date(sourceArray[i][propName]);
                            if (tempDate > date1) {
                                sourceArray[i].visibility[propName] = true;
                            }
                            else {
                                sourceArray[i].visibility[propName] = false;
                            }
                        }
                        break;
                    case 2:
                        for (let i = 0; i < sourceArray.length; i++) {
                            let tempDate = new Date(sourceArray[i][propName]);
                            if (tempDate < date1) {
                                sourceArray[i].visibility[propName] = true;
                            }
                            else {
                                sourceArray[i].visibility[propName] = false;
                            }
                        }
                        break;
                    case 3:
                        for (let i = 0; i < sourceArray.length; i++) {
                            let tempDate = new Date(sourceArray[i][propName]);
                            if (tempDate > date1 && tempDate < date2) {
                                sourceArray[i].visibility[propName] = true;
                            }
                            else {
                                sourceArray[i].visibility[propName] = false;
                            }
                        }
                        break;
                }
            }
            else {
                for (let i = 0; i < sourceArray.length; i++) {
                    sourceArray[i].visibility[propName] = true;
                }
            }
        }

    }

    function ValidateNumber(relatedTag, propVal) {
        let numRegExp = /^[0-9]+$/;
        if (numRegExp.test(propVal)) {
            $(relatedTag).removeClass("invalid");
            return true;
        }
        else {
            $(relatedTag).addClass("invalid");
            return false;
        }
    }

    function ValidateString(relatedTag, propVal) {
        let strRegExp = /^[a-zA-Z0-9]+$/;
        if (strRegExp.test(propVal)) {
            $(relatedTag).removeClass("invalid");
            return true;
        }
        else {
            $(relatedTag).addClass("invalid");
            return false;
        }
    }

    function ValidateDate(relatedTag, propVal, typeOfDate) {
        let isValid = false;
        if (typeOfDate == "gregorian") {
            let dateRegExp = /^(19|20)\d{2}\/(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])$/;
            if (dateRegExp) {
                if (dateRegExp.test(propVal)) {
                    isValid = true;
                }
                else {
                    isValid = false;
                }
            }
        }
        else if (typeOfDate == "shamsi") {
            let dateArr = propVal.split('/');
            if (dateArr.length == 3) {
                let shamsiDate = new ShamsiDate(dateArr[0], dateArr[1], dateArr[2]);
                isValid = shamsiDate.Validate();
            }
            else {
                isValid = false;
            }
        }

        if (isValid) {
            $(relatedTag).removeClass("invalid");
            return true;
        }
        else {
            $(relatedTag).addClass("invalid");
            return false;
        }
    }
}

{
    //class Personnel {
    //    constructor(firstname, lastname, personnelcode, isactive, birthDate) {
    //        this.FirstName = firstname;
    //        this.LastName = lastname;
    //        this.PersonnelCode = personnelcode;
    //        this.IsActive = isactive;
    //        this.IsActive1 = isactive;
    //        this.BirthDate = birthDate;
    //    }

    //    Edit(obj) {
    //        let parentRow = this.rowObj;
    //        let parentTable = parentRow;
    //        let tagName = $(parentTable).prop("tagName").toLowerCase();
    //        while (tagName != "table" && tagName != "body") {
    //            parentTable = $(parentTable).parent();
    //            tagName = $(parentTable).prop("tagName").toLowerCase();
    //        }

    //        if (tagName == "table") {
    //            if ($(parentTable).find('tr[ineditmode="true"]').length > 0) {
    //                alert("you have unsaved row!");
    //            }
    //            else {
    //                var accBtn = $(obj).siblings(".acceptBtn")[0];
    //                $(accBtn).css("display", "inline");
    //                $(obj).css("display", "none");
    //                $(parentRow).find("input").attr("disabled", false);
    //                $(parentRow).attr("inEditMode", "true");
    //            }
    //        }
    //    }

    //    Accept(obj) {
    //        let parentRow = this.rowObj;
    //        var editBtn = $(obj).siblings(".editBtn")[0];

    //        let parentTable = parentRow;
    //        let tagName = $(parentTable).prop("tagName").toLowerCase();
    //        while (tagName != "table" && tagName != "body") {
    //            parentTable = $(parentTable).parent();
    //            tagName = $(parentTable).prop("tagName").toLowerCase();
    //        }

    //        if (tagName == "table") {

    //            let firstName = $(parentRow).find('[data-bind="content:FirstName"]');
    //            firstName = $(firstName[0]).val();
    //            let lastName = $(parentRow).find('[data-bind="content:LastName"]');
    //            lastName = $(lastName[0]).val();
    //            let personnelCode = $(parentRow).find('[data-bind="content:PersonnelCode"]');
    //            personnelCode = $(personnelCode[0]).val();
    //            let isActive = $(parentRow).find('[data-bind="content:IsActive"]');
    //            isActive = $(isActive[0]).prop("checked");
    //            let birthDate = $(parentRow).find('[data-bind="content:BirthDate"]');
    //            birthDate = $(birthDate[0]).val();

    //            let isValid = true;
    //            let relatedTag, propVal, res;
    //            let headersToValidate = $(parentTable).find('th[validate="true"]');
    //            if (headersToValidate) {

    //                for (let i = 0; i < headersToValidate.length; i++) {

    //                    let dataBindAttr = $(headersToValidate[i]).attr("data-bind");
    //                    let type = $(headersToValidate[i]).attr("type");
    //                    if (type) {

    //                        switch (type) {
    //                            case "string":
    //                            case "text":
    //                                relatedTag = $(parentRow).find('[data-bind="' + dataBindAttr + '"]');
    //                                propVal = $(relatedTag[0]).val();
    //                                res = ValidateString(relatedTag[0], propVal);
    //                                if (!res) {
    //                                    isValid = false;
    //                                }
    //                                break;
    //                            case "number":
    //                                relatedTag = $(parentRow).find('[data-bind="' + dataBindAttr + '"]');
    //                                propVal = $(relatedTag[0]).val();
    //                                res = ValidateNumber(relatedTag[0], propVal);
    //                                if (!res) {
    //                                    isValid = false;
    //                                }
    //                                break;
    //                            case "date":
    //                                relatedTag = $(parentRow).find('[data-bind="' + dataBindAttr + '"]');
    //                                propVal = $(relatedTag[0]).val();
    //                                let typeOfDate = $(headersToValidate[i]).attr("typeOfDate");
    //                                res = ValidateDate(relatedTag[0], propVal, typeOfDate);
    //                                if (!res) {
    //                                    isValid = false;
    //                                }
    //                                break
    //                        }
    //                    }
    //                }
    //            }
    //            if (isValid == true) {
    //                $(editBtn).css("display", "inline");
    //                $(obj).css("display", "none");
    //                $(parentRow).find("input").attr("disabled", true);
    //                $(parentRow).attr("inEditMode", "false");
    //                this.FirstName = firstName;
    //                this.LastName = lastName;
    //                this.PersonnelCode = personnelCode;
    //                this.IsActive = isActive;
    //                this.BirthDate = birthDate;
    //                $(parentRow).removeAttr("unsavedNewRow");
    //            }
    //        }

    //    }

    //    Delete(obj) {
    //        let parentRow = this.rowObj;
    //        let inEditMode = $(parentRow).attr("inEditMode");
    //        let isUnsavedNewRow = $(parentRow).attr("unsavedNewRow");

    //        if (isUnsavedNewRow || !inEditMode || inEditMode == "false") {

    //            let parentTable = parentRow;
    //            let tagName = $(parentTable).prop("tagName").toLowerCase();
    //            while (tagName != "table" && tagName != "body") {
    //                parentTable = $(parentTable).parent();
    //                tagName = $(parentTable).prop("tagName").toLowerCase();
    //            }

    //            if (tagName == "table") {

    //                if (isUnsavedNewRow) {
    //                    $(parentRow).remove();
    //                    let newArr = [];
    //                    for (let i = 0; i < personnelArray.length; i++) {
    //                        if (personnelArray[i].rowObj != this.rowObj) {
    //                            newArr.push(personnelArray[i]);
    //                        }
    //                    }
    //                    personnelArray = newArr;
    //                }
    //                else {
    //                    if ($(parentTable).find('tr[ineditmode="true"]').length > 0) {
    //                        alert("you have unsaved row!");
    //                    }
    //                    else {
    //                        //ask for deletion
    //                        if (confirm("are you sure?")) {
    //                            $(parentRow).remove();
    //                            let newArr = [];
    //                            for (let i = 0; i < personnelArray.length; i++) {
    //                                if (personnelArray[i].rowObj != this.rowObj) {
    //                                    newArr.push(personnelArray[i]);
    //                                }
    //                            }

    //                            personnelArray = newArr;
    //                        }
    //                        else {
    //                            console.log("canceled!");
    //                        }
    //                    }
    //                }
    //            }
    //        }
    //        else if (inEditMode && inEditMode == "true") {

    //            let acceptBtn = $(obj).siblings(".acceptBtn")[0];
    //            let editBtn = $(obj).siblings(".editBtn")[0];
    //            $(editBtn).css("display", "inline");
    //            $(acceptBtn).css("display", "none");
    //            $(parentRow).find("input").attr("disabled", true);
    //            $(parentRow).attr("inEditMode", "false");

    //            //restore values
    //            let firstName = $(parentRow).find('[data-bind="content:FirstName"]');
    //            $(firstName[0]).val(this.FirstName);

    //            let lastName = $(parentRow).find('[data-bind="content:LastName"]');
    //            $(lastName[0]).val(this.LastName);

    //            let isActive = $(parentRow).find('[data-bind="content:IsActive"]');
    //            $(isActive[0]).prop("checked", this.IsActive);

    //            let tooltip = $(parentRow).find(".invalid-input-tooltip");
    //            if (tooltip && tooltip.length > 0) {
    //                $(tooltip).css("opacity", "0");
    //            }
    //            $(parentRow).find(".invalid").removeClass("invalid");
    //        }
    //    }
    //}

    //var personnelArray = [
    //    new Personnel("gzahra", "rahimi", 29, true, "1990/09/13"),
    //    new Personnel("zahra2", "rahimi2", 30, false, "1994/07/20"),
    //    new Personnel("zahra3", "rahimi3", 31, true, "1998/12/18"),
    //    new Personnel("zahra4", "rahimi4", 32, false, "2000/05/10")
    //];

    //class TableClass {
    //    constructor(table, datagrid, dataSource) {
    //        this.Table = table;
    //        this.Datagrid = datagrid;
    //        this.DataSource = dataSource;
    //    }

    //    AddRow() {

    //        let dataSource = this.DataSource;
    //        //    console.log(this.DataSource);
    //        let editableDataGrid = this.Datagrid;
    //        let table = this.Table;

    //        if ($(table).find('tr[ineditmode="true"]').length > 0) {
    //            alert("you have unsaved row!");
    //        }
    //        else {

    //            var columns = $(editableDataGrid).find("column");

    //            var row = '<tr>';
    //            row += '<td class="stickyTd"><div class="btnDivBackground">' +
    //                ' <button class="delBtn WBbutton" onclick="DeleteRow(this)"><span class="icon-x-button"></span></button>' +
    //                ' <button class="editBtn  WBbutton" onclick="EditRow(this)" style="display:none;"><span class="icon-pencil"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span><span class="path13"></span><span class="path14"></span><span class="path15"></span></span></button>' +
    //                ' <button class="acceptBtn WBbutton" onclick="AcceptRow(this)" style="font-size:22px;"><span class="icon-check"></span></button>' +
    //                '</div></td>';

    //            if (columns && columns.length > 0) {
    //                for (i = 0; i < columns.length; i++) {
    //                    let dataToBeInserted = "";
    //                    var dBindAttr = "";
    //                    var innerHtml = columns[i].innerHTML;
    //                    if (innerHtml.trim().length > 0) {
    //                        var newTag = innerHtml.toString().trim();
    //                        newTag = $.parseHTML(newTag);
    //                        var tempDiv = document.createElement("div");
    //                        tempDiv.append(newTag[0]);
    //                        dataToBeInserted = tempDiv.innerHTML;
    //                    }
    //                    else {
    //                        dataToBeInserted = "";
    //                        dBindAttr = $(columns[i]).attr("data-bind");
    //                    }

    //                    var hideColumn = $(columns[i]).attr("hide");
    //                    if (hideColumn !== undefined) {
    //                        var tdTmp = "<td style='display:none;'>" + dataToBeInserted + "</td>";
    //                        if (tdTmp.toLowerCase().indexOf("data-bind") < 0) {
    //                            var tdTmp = $.parseHTML(tdTmp);
    //                            $(tdTmp[0]).attr("data-bind", "content:" + dBindAttr);
    //                            tdTmp = tdTmp[0].outerHTML;
    //                        }
    //                        row += tdTmp;

    //                    }
    //                    else {
    //                        var tdTmp = "<td>" + dataToBeInserted + "</td>";
    //                        if (tdTmp.toLowerCase().indexOf("data-bind") < 0) {
    //                            var tdTmp = $.parseHTML(tdTmp);
    //                            $(tdTmp[0]).attr("data-bind", "content:" + dBindAttr);
    //                            tdTmp = tdTmp[0].outerHTML;
    //                        }
    //                        row += tdTmp;
    //                    }
    //                }
    //            }

    //            row += "</tr>";
    //            var tbody = $(table).children("tbody");
    //            var trObj = $.parseHTML(row);
    //            let newPerson = new Personnel(null, null, null, null);
    //            newPerson.rowObj = trObj[0];
    //            newPerson.visibility = [];
    //            dataSource.push(newPerson);
    //            $(trObj).attr("role", "tableRow");
    //            $(trObj).attr("unsavedNewRow", "true");
    //            $(trObj).attr("inEditMode", "true");
    //            tbody.append(trObj);
    //        }
    //    }

    //    FilterHandler(relatedTH, relatedModal) {
    //        let dataSource = this.DataSource;
    //        //console.log(dataSource);
    //        let modalBody = $(relatedModal).find(".modal-body");
    //        let type = $(relatedTH).attr("type");
    //        let bindingAttr = $(relatedTH).attr("data-bind");
    //        let binding = "";
    //        if (bindingAttr) {
    //            let inx = bindingAttr.toLowerCase().indexOf("content:")
    //            if (inx > -1) {
    //                inx += 8;
    //                while (inx < bindingAttr.length && bindingAttr[inx] != ';') {
    //                    binding += bindingAttr[inx];
    //                    inx++;
    //                }
    //            }

    //        }
    //        binding = binding.trim();

    //        let inputs, inputVal, selectedIndex, selectTags, firstInput, secondInput;

    //        if (type) {
    //            type = type.toLowerCase();
    //            switch (type) {
    //                case "string":
    //                    inputs = $(modalBody).find("input[type=text]");
    //                    selectTags = $(modalBody).find("select");
    //                    inputVal = $(inputs[0]).val();
    //                    selectedIndex = $(selectTags[0]).prop("selectedIndex");
    //                    if (binding.length > 0) {
    //                        switch (selectedIndex) {
    //                            case 1:
    //                                let temp = "^" + inputVal;
    //                                inputVal = temp;
    //                                break;
    //                            case 2:
    //                                inputVal += "$";
    //                                break;
    //                        }
    //                    }
    //                    StringDataArraySearch(dataSource, binding, inputVal);
    //                    break;
    //                case "number":
    //                    selectTags = $(modalBody).find("select");
    //                    selectedIndex = $(selectTags[0]).prop("selectedIndex");
    //                    inputs = $(modalBody).find("input[type=text]");
    //                    firstInput = $(inputs[0]).val();
    //                    secondInput = $(inputs[1]).val();
    //                    NumberDataArraySearch(dataSource, binding, firstInput, secondInput, selectedIndex);
    //                    break;
    //                case "boolean":
    //                    inputs = $(modalBody).find("input[type=checkbox]");
    //                    let trueCheckBox = $(inputs[0]).prop("checked");
    //                    let falseCheckBox = $(inputs[1]).prop("checked");
    //                    BooleanDataArraySearch(dataSource, binding, trueCheckBox, falseCheckBox);
    //                    break;
    //                case "date":
    //                    selectTags = $(modalBody).find("select");
    //                    selectedIndex = $(selectTags[0]).prop("selectedIndex");
    //                    inputs = $(modalBody).find("input[type=text]");
    //                    firstInput = $(inputs[0]).val();
    //                    secondInput = $(inputs[1]).val();
    //                    DateDataArraySearch(dataSource, binding, firstInput, secondInput, selectedIndex);
    //                    break;
    //                //case "combobox":
    //                //    selectTags = $(modalBody).find("select");
    //                //    selectedIndex = $(selectTags[0]).prop("selectedIndex");
    //                //    //console.log(selectedIndex);
    //                //    break;
    //            }
    //        }

    //        for (let i = 0; i < dataSource.length; i++) {
    //            $(dataSource[i].rowObj).css("display", "table-row");
    //            if (dataSource[i].visibility) {
    //                for (let j in dataSource[i].visibility) {
    //                    if (dataSource[i].visibility[j] == false) {
    //                        $(dataSource[i].rowObj).css("display", "none");
    //                    }
    //                }
    //            }
    //        }

    //        $(relatedModal).css("display", "none");
    //    }

    //    ClearFilter(relatedTH, relatedModal) {

    //        let type = $(relatedTH).attr("type");
    //        let bindingAttr = $(relatedTH).attr("data-bind");

    //        let modalBody = $(relatedModal).find(".modal-body");

    //        let inputs = null;
    //        let selectTags = null;
    //        if (type) {
    //            type = type.toLowerCase();
    //            switch (type) {
    //                case "string":
    //                    inputs = $(modalBody).find("input[type=text]");
    //                    $(inputs).val('');
    //                    selectTags = $(modalBody).find("select");
    //                    $(selectTags).prop("selectedIndex", 0);
    //                    $(selectTags).change();
    //                    break;
    //                case "number":
    //                    inputs = $(modalBody).find("input[type=text]");
    //                    $(inputs).val('');
    //                    selectTags = $(modalBody).find("select");
    //                    $(selectTags).prop("selectedIndex", 0);
    //                    $(selectTags).change();

    //                    break;
    //                case "boolean":
    //                    inputs = $(modalBody).find("input[type=checkbox]");
    //                    $(inputs).prop("checked", false);
    //                    $(inputs).val("false");
    //                    $(inputs).attr("checked", false);
    //                    break;
    //                case "combobox":
    //                    selectTags = $(modalBody).find("select");
    //                    $(selectTags).prop("selectedIndex", 0);
    //                    $(selectTags).change();

    //                    let options = $(selectTags[0]).children("option");
    //                    let selectedOption = options[0];
    //                    let optText = $(selectedOption).text();
    //                    let labelTag = $(selectTags[0]).siblings(".selectedItem");
    //                    $(labelTag[0]).text("...");
    //                    break;
    //                case "date":
    //                    inputs = $(modalBody).find("input[type=text]");
    //                    $(inputs).val('');
    //                    selectTags = $(modalBody).find("select");
    //                    $(selectTags).prop("selectedIndex", 0);
    //                    $(selectTags).change();
    //                    break;
    //            }
    //        }
    //        // $(relatedModal).css("display", "none");
    //    }
    //}
}

function initGrids() {


    let grids = $(document).find("EditableDataGrid");

    if (grids && grids.length > 0) {

        for (k = 0; k < grids.length; k++) {

            let dsString = grids[k].getAttribute("data-bind").split(",").find(f => f.toLowerCase().includes("sourceitems"));
            if (dsString === undefined)
                continue;
            let ds = dataContext[dsString.split(":")[1]];
            if (ds === undefined)
                continue;
            let gridObj = new PalizGrid(ds, grids[k]);
        }
    }

    //checkResizableTables();

    //checkSortableTables();

    //checkFilterableTableColumns();

    $(document).on("mouseover", 'input.invalid', function () {

        let dataBindAttr = $(this).attr("data-bind");

        let parent = $(this);
        let tagName = $(parent).prop("tagName").toLowerCase();
        let parentRow;
        while (tagName != "table" && tagName != "body") {
            parent = $(parent).parent();
            tagName = $(parent).prop("tagName").toLowerCase();
            if (tagName == "tr") {
                parentRow = parent;
            }
        }

        if (tagName == "table") {
            parent = parent[0];
            let tHead = $(parent).find("thead");
            let headTag = $(tHead[0]).find('[data-bind="' + dataBindAttr + '"]');

            if (headTag) {

                headTag = headTag[0];
                tagName = $(headTag).prop("tagName").toLowerCase();

                while (tagName != "th" && tagName != "body") {
                    headTag = $(headTag).parents();
                    tagName = $(headTag).prop("tagName").toLowerCase();
                }

                if (tagName == "th") {
                    let message = $(headTag).attr("invalid-input-message");
                    let tooltip = $(parent).find('.invalid-input-tooltip2' + '[data-bind="' + dataBindAttr + '"]');

                    let tHeadTop = $(tHead[0]).offset().top;
                    let parentRowTop = $(parentRow).offset().top;

                    let elementLeft = $(this).offset().left;
                    let tableLeft = $(parent).offset().left;
                    let elementWidth = $(this).width();
                    let y = (parentRowTop - tHeadTop) + $(parentRow).height();
                    let x = elementLeft - tableLeft;
                    let tooltipWidth;
                    if (!tooltip || tooltip.length == 0) {
                        tooltip = $.parseHTML('<span class="invalid-input-tooltip2">' + message + '</span>');
                        $(tooltip).attr("data-bind", dataBindAttr);
                        $(parent).prepend(tooltip);
                        setTimeout(n => {
                            tooltipWidth = $(tooltip).outerWidth();
                            $(tooltip).css("top", y + "px");
                            $(tooltip).css("left", (x - Math.ceil((tooltipWidth - elementWidth) / 2)) + "px");
                            $(tooltip).css("opacity", "1");
                        }, 40);
                    }
                    else {
                        setTimeout(n => {
                            tooltipWidth = $(tooltip).outerWidth();
                            $(tooltip).css("top", y + "px");
                            $(tooltip).css("left", (x - Math.ceil((tooltipWidth - elementWidth) / 2)) + "px");
                            $(tooltip).css("opacity", "1");
                        }, 40);
                    }
                }
            }
        }
    });

    $(document).on("mouseleave", 'input.invalid', function () {

        let dataBindAttr = $(this).attr("data-bind");
        let parent = $(this);
        let tagName = $(parent).prop("tagName").toLowerCase();
        while (tagName != "table" && tagName != "body") {
            parent = $(parent).parent();
            tagName = $(parent).prop("tagName").toLowerCase();
        }

        if (tagName == "table") {
            parent = parent[0];
            let tooltip = $(parent).find('.invalid-input-tooltip2' + '[data-bind="' + dataBindAttr + '"]');
            $(tooltip).css("opacity", "0");
        }
    });
}

{
    //    function AddRow(self) {

    //        var parentTable = self;
    //        var tagName = $(parentTable).prop("tagName").toLowerCase();

    //        while (tagName != "table" && tagName != "body") {
    //            parentTable = $(parentTable).parent();
    //            tagName = $(parentTable).prop("tagName").toLowerCase();
    //        }

    //        if (tagName == "table") {
    //            for (key in dataGridTableObjArray) {
    //                if ((dataGridTableObjArray[key]).Table == parentTable[0]) {
    //                    (dataGridTableObjArray[key]).AddRow();
    //                }
    //            }
    //        }
    //    }


    //    function DeleteRow(self) {

    //        var parentRow = self;
    //        var roleAttr = $(parentRow).attr('role');
    //        var isTableRow = (roleAttr && roleAttr.toLowerCase() == "tablerow") ? true : false;

    //        while (!isTableRow && $(parentRow).prop("tagName").toLowerCase() != "body") {
    //            parentRow = $(parentRow).parent();
    //            roleAttr = $(parentRow).attr('role');
    //            isTableRow = (roleAttr && roleAttr.toLowerCase() == "tablerow") ? true : false;
    //        }

    //        let parentTable = parentRow;
    //        let tagName = $(parentTable).prop("tagName").toLowerCase();
    //        while (tagName != "table" && tagName != "body") {
    //            parentTable = $(parentTable).parent();
    //            tagName = $(parentTable).prop("tagName").toLowerCase();
    //        }

    //        if (tagName == "table") {

    //            for (key in dataGridTableObjArray) {
    //                if ((dataGridTableObjArray[key]).Table == parentTable[0]) {
    //                    if (isTableRow) {
    //                        var resultObj = GetObjectInstanceFromTableRow(parentRow[0], (dataGridTableObjArray[key]).DataSource);
    //                        if (resultObj) {
    //                            resultObj.Delete(self);
    //                        }
    //                        else {
    //                            console.log("row object not found");
    //                        }
    //                    }
    //                    break;
    //                }
    //            }
    //        }
    //    };


    //    function EditRow(self) {
    //        var parentRow = self;
    //        var roleAttr = $(parentRow).attr('role');
    //        var isTableRow = (roleAttr && roleAttr.toLowerCase() == "tablerow") ? true : false;

    //        while (!isTableRow && $(parentRow).prop("tagName").toLowerCase() != "body") {
    //            parentRow = $(parentRow).parent();
    //            roleAttr = $(parentRow).attr('role');
    //            isTableRow = (roleAttr && roleAttr.toLowerCase() == "tablerow") ? true : false;
    //        }

    //        let parentTable = parentRow;
    //        let tagName = $(parentTable).prop("tagName").toLowerCase();
    //        while (tagName != "table" && tagName != "body") {
    //            parentTable = $(parentTable).parent();
    //            tagName = $(parentTable).prop("tagName").toLowerCase();
    //        }

    //        if (tagName == "table") {

    //            for (key in dataGridTableObjArray) {
    //                if ((dataGridTableObjArray[key]).Table == parentTable[0]) {
    //                    if (isTableRow) {
    //                        var resultObj = GetObjectInstanceFromTableRow(parentRow[0], dataGridTableObjArray[key].DataSource);

    //                        if (resultObj) {
    //                            resultObj.Edit(self);
    //                        }
    //                        else {
    //                            console.log("row object not found");
    //                        }
    //                    }
    //                    break;
    //                }
    //            }
    //        }
    //    }



    //function AcceptRow(self) {
    //    var parentRow = self;
    //    var roleAttr = $(parentRow).attr('role');
    //    var isTableRow = (roleAttr && roleAttr.toLowerCase() == "tablerow") ? true : false;

    //    while (!isTableRow && $(parentRow).prop("tagName").toLowerCase() != "body") {
    //        parentRow = $(parentRow).parent();
    //        roleAttr = $(parentRow).attr('role');
    //        isTableRow = (roleAttr && roleAttr.toLowerCase() == "tablerow") ? true : false;
    //    }

    //    let parentTable = parentRow;
    //    let tagName = $(parentTable).prop("tagName").toLowerCase();
    //    while (tagName != "table" && tagName != "body") {
    //        parentTable = $(parentTable).parent();
    //        tagName = $(parentTable).prop("tagName").toLowerCase();
    //    }

    //    if (tagName == "table") {
    //        for (key in dataGridTableObjArray) {
    //            if ((dataGridTableObjArray[key]).Table == parentTable[0]) {
    //                if (isTableRow) {
    //                    var resultObj = GetObjectInstanceFromTableRow(parentRow[0], (dataGridTableObjArray[key]).DataSource);
    //                    if (resultObj) {
    //                        resultObj.Accept(self);
    //                    }
    //                    else {
    //                        console.log("row object not found");
    //                    }
    //                }
    //                break;
    //            }
    //        }
    //    }
    //}


    //function filterBtnClicked(e, obj) {

    //    e.stopPropagation();

    //    let parentTH = obj;
    //    let isObjHeader = $(parentTH).prop("tagName").toLowerCase() == "th";

    //    while (!isObjHeader && $(parentTH).prop("tagName").toLowerCase() != "body") {
    //        parentTH = $(parentTH).parent();
    //        isObjHeader = $(parentTH).prop("tagName").toLowerCase() == "th";
    //    }

    //    if (isObjHeader) {

    //        let parentTable = parentTH;
    //        let isTable = $(parentTable).prop("tagName").toLowerCase() == "table";

    //        while (!isTable && $(parentTable).prop("tagName").toLowerCase() != "body") {
    //            parentTable = $(parentTable).parent();
    //            isTable = $(parentTable).prop("tagName").toLowerCase() == "table";
    //        }

    //        if (isTable) {

    //            let inEditModeRows = $(parentTable).find('tr[ineditmode="true"]');
    //            if (inEditModeRows && inEditModeRows.length > 0) {
    //                alert("you have unsaved row");
    //                return;
    //            }

    //            let dataBindAttr = $(parentTH).attr("data-bind");
    //            let modal = $(parentTable).find('.modal[data-bind= "' + dataBindAttr + '"]');
    //            let modalContent = $(modal).find(".modal-content");

    //            let parentThTop = $(parentTH).offset().top;
    //            let parentThHeight = $(parentTH).height();
    //            $(modalContent[0]).css("top", (parentThTop + parentThHeight + 1) + "px");
    //            $(modal).css("display", "block");

    //            let tableLeft = $(parentTable).offset().left;
    //            let modalContentWidth = modalContent[0].clientWidth;

    //            let headerLeft = $(parentTH).offset().left;
    //            let headerWidth = $(parentTH).width();

    //            let x = (headerLeft + headerWidth) - tableLeft;

    //            if (x > modalContentWidth) {
    //                //place from right side of the column
    //                $(modalContent[0]).css("left", ((headerLeft + headerWidth) - modalContentWidth) + "px");
    //                $(":root").get(0).style.setProperty("--modal-left", "75%");

    //            } else {
    //                //place from left side
    //                $(modalContent[0]).css("left", (headerLeft) + "px");
    //                $(":root").get(0).style.setProperty("--modal-left", "25%");
    //            }
    //        }
    //    }
    //}


    //function applyFilterClicked(e, obj) {

    //    let parentModal = obj;
    //    let isModalParent = $(parentModal).hasClass("modal");

    //    while (!isModalParent && $(parentModal).prop("tagName").toLowerCase() != "body") {

    //        parentModal = $(parentModal).parent();
    //        isModalParent = $(parentModal).hasClass("modal");
    //    }

    //    if (isModalParent) {

    //        let dataBindAttr = $(parentModal).attr("data-bind");
    //        let parentTable = $(parentModal);
    //        let tagName = $(parentTable).prop("tagName").toLowerCase();

    //        while (tagName != "table" && tagName != "body") {

    //            parentTable = $(parentTable).parent();
    //            tagName = $(parentTable).prop("tagName").toLowerCase();
    //        }

    //        if (tagName == "table") {

    //            let relatedTH = $(parentTable).find('th[data-bind="' + dataBindAttr + '"]');
    //            for (key in dataGridTableObjArray) {

    //                if ((dataGridTableObjArray[key]).Table == parentTable[0]) {
    //                    (dataGridTableObjArray[key]).FilterHandler(relatedTH[0], parentModal[0]);
    //                }
    //            }
    //        }
    //    }
    //}


    //function clearFilterClicked(e, obj) {

    //    let parentModal = obj;
    //    let isModalParent = $(parentModal).hasClass("modal");

    //    while (!isModalParent && $(parentModal).prop("tagName").toLowerCase() != "body") {

    //        parentModal = $(parentModal).parent();
    //        isModalParent = $(parentModal).hasClass("modal");
    //    }

    //    if (isModalParent) {

    //        let dataBindAttr = $(parentModal).attr("data-bind");
    //        let parentTable = $(parentModal);
    //        let tagName = $(parentTable).prop("tagName").toLowerCase();

    //        while (tagName != "table" && tagName != "body") {

    //            parentTable = $(parentTable).parent();
    //            tagName = $(parentTable).prop("tagName").toLowerCase();
    //        }

    //        if (tagName == "table") {

    //            let relatedTH = $(parentTable).find('th[data-bind="' + dataBindAttr + '"]');


    //            for (key in dataGridTableObjArray) {

    //                if ((dataGridTableObjArray[key]).Table == parentTable[0]) {
    //                    (dataGridTableObjArray[key]).ClearFilter(relatedTH[0], parentModal[0]);
    //                }
    //            }
    //        }
    //    }
    //}


    //function checkboxOnClick(e, obj) {

    //    let isChecked = $(obj).prop("checked");
    //    if (isChecked) {
    //        $(obj).attr("checked", "checked");
    //        $(obj).val("true");
    //    }
    //    else {
    //        $(obj).attr("checked", false);
    //        $(obj).val("false");
    //    }
    //}


    //function selectionChanged(obj) {
    //    let selectedIndex = $(obj).prop("selectedIndex");
    //    let options = $(obj).children("option");
    //    let selectedOption = options[selectedIndex];
    //    let optText = $(selectedOption).text();

    //    let labelTag = $(obj).siblings(".selectedItem");
    //    $(labelTag[0]).text(optText);

    //}


    //function buildAndFillDatagrid(dataGridTag) {

    //    var mainParent = $(dataGridTag).parent();
    //    var columns = $(dataGridTag).find("column");
    //    var mTable = $.parseHTML('<table><thead><tr></tr></thead><tbody></tbody></table>');

    //    let bindingAttr = $(dataGridTag).attr("data-bind");

    //    let binding = "";
    //    if (bindingAttr) {
    //        if (bindingAttr.indexOf("SourceItems:") > -1) {
    //            binding = bindingAttr.split(":")[1];
    //        }
    //    }
    //    let arr = this[binding];
    //    let newDatagridTableObj = new TableClass(mTable[0], dataGridTag, arr);

    //    dataGridTableObjArray.push(newDatagridTableObj);

    //    $(mTable).attr("data-bind", bindingAttr);
    //    $(mTable).attr("role", "dataGrid");
    //    var isSortable = $(dataGridTag).attr("sortable");
    //    if (isSortable == "true") {
    //        $(mTable).attr("sortable", "true");
    //    }
    //    var isResizable = $(dataGridTag).attr("isResizable");
    //    if (isResizable == "true") {
    //        $(mTable).attr("isResizable", "true");
    //    }
    //    var isFilterable = $(dataGridTag).attr("filterable");
    //    if (isFilterable == "true") {
    //        $(mTable).attr("filterable", "true");
    //    }
    //    var verticalBorder = $(dataGridTag).attr("vertical-border");
    //    if (verticalBorder == "true") {
    //        $(mTable).addClass("withVerticalBorders");
    //    }
    //    var horizontalBorder = $(dataGridTag).attr("horizontal-border");
    //    if (horizontalBorder == "true") {
    //        $(mTable).addClass("withHorizontalBorders");
    //    }

    //    var footerContent = $(dataGridTag).find("footer");
    //    if (footerContent && $(footerContent).length > 0) {
    //        var footerTxt = $(footerContent).html().toString().replace("trdiv", "tr");
    //        footerTxt = footerTxt.replace("tddiv", "td");
    //        $(mTable).append('<tfoot>' + footerTxt + '</tfoot>');
    //        footer = $(mTable).find('tfoot');
    //        var tds = $(footer).find("td");
    //        if (tds && tds.length > 0) {
    //            for (j = 0; j < tds.length; j++) {
    //                $(tds[j]).addClass("stickyFooter");
    //            }
    //        }
    //    }

    //    $(mainParent).append(mTable);

    //    var thead = $(mTable).find("thead");
    //    var theadTr = $(thead).find("tr");
    //    theadTr.append('<th class="buttonColumn stickyTh"><button class="addBtn WBbutton" onclick="AddRow(this)" style="font-size:24px;"><span class="icon-plus"></span></button ></th>');

    //    for (var i = 0; i < columns.length; i++) {
    //        var dataBindAttr = $(columns[i]).attr("data-bind");
    //        if (!dataBindAttr) {
    //            dataBindAttr = $(columns[i]).find("[data-bind]").attr("data-bind");
    //        }
    //        var hideColumn = $(columns[i]).attr("hide");
    //        let header = "";
    //        if (hideColumn !== undefined) {
    //            header = '<th style="display: none; "><div class="headerContent">' + $(columns[i]).attr("header") + "</div></th>";
    //        }
    //        else {
    //            header = '<th class="stickyTh"><div class="headerContent"><span class="sortSpan"></span><p class="titleSpan">' + $(columns[i]).attr("header") + "</p></div></th>";
    //        }
    //        header = $(header);
    //        $(header).attr("data-bind", dataBindAttr);
    //        let filterable = $(columns[i]).attr("filterable");
    //        if (filterable !== undefined) {
    //            type = $(columns[i]).attr("type");
    //            if (type) {
    //                //if (filterable !== undefined) {
    //                $(header).attr("filterable", "true");
    //                //}
    //                $(header).attr("type", type);
    //            }
    //        }
    //        let validateCol = $(columns[i]).attr("validate");
    //        if (validateCol) {
    //            let type = $(columns[i]).attr("type");
    //            $(header).attr("validate", validateCol);
    //            $(header).attr("type", type);

    //            if (type && type == "date") {
    //                let typeOfDate = $(columns[i]).attr("typeOfDate");
    //                $(header).attr("typeOfDate", typeOfDate);
    //            }
    //        }

    //        let invalidInputMessage = $(columns[i]).attr("invalid-input-message");
    //        if (invalidInputMessage) {
    //            $(header).attr("invalid-input-message", invalidInputMessage);
    //        }

    //        theadTr.append(header);
    //    }

    //    var datagridClasses = $(dataGridTag).attr("class");
    //    if (datagridClasses && datagridClasses.trim().length > 0) {
    //        $(mTable).addClass(datagridClasses);
    //    }

    //    fillTableRows(dataGridTag, this[binding]);

    //    $(dataGridTag).css("display", "none");
    //}


    //function fillTableRows(dataGridTag, dataList) {

    //    if (dataGridTag) {

    //        var table = null;
    //        for (key in dataGridTableObjArray) {
    //            if ((dataGridTableObjArray[key]).Datagrid == dataGridTag) {
    //                table = (dataGridTableObjArray[key]).Table;
    //            }
    //        }

    //        if (table) {

    //            var tbody = $(table).find("tbody");
    //            for (i = 0; i < dataList.length; i++) {
    //                let dataRow = dataList[i];
    //                let tableRow = document.createElement("tr");
    //                let tableCol = document.createElement("td");
    //                tableCol.className = "stickyTd";
    //                tableCol.innerHTML =
    //                    '<div class="btnDivBackground">' +
    //                    ' <button class="delBtn WBbutton" onclick="DeleteRow(this)"><span class="icon-x-button"></span></button>' +
    //                    ' <button class="editBtn WBbutton" onclick="EditRow(this)"><span class="icon-pencil"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span><span class="path13"></span><span class="path14"></span><span class="path15"></span></span></button>' +
    //                    ' <button class="acceptBtn WBbutton" onclick="AcceptRow(this)" style="display:none;font-size:22px;"><span class="icon-check"></span></button>' +
    //                    '</div>';
    //                tableRow.append(tableCol);

    //                for (key in dataRow) {

    //                    let tags = $(dataGridTag).find('[data-bind="content:' + key + '"]');
    //                    if (tags && tags.length > 0) {
    //                        let dataTag = $(tags[0]);
    //                        isColumn = (dataTag.prop("tagName").toLowerCase() == "column");
    //                        while (!isColumn && dataTag.prop("tagName").toLowerCase() != "body") {
    //                            dataTag = dataTag.parent();
    //                            isColumn = (dataTag.prop("tagName").toLowerCase() == "column");
    //                        }
    //                        let tdEl = document.createElement("td");
    //                        if (!isColumn) { continue; }

    //                        if (dataTag[0].innerHTML.trim().length > 0) {
    //                            tdEl.innerHTML = dataTag[0].innerHTML.trim();
    //                            let innerEl = tdEl.querySelectorAll('[data-bind="content:' + key + '"]');
    //                            innerEl[0].value = dataRow[key];
    //                            if ($(innerEl).is("input"))
    //                                $(innerEl).addClass("testInput");
    //                        }
    //                        else {
    //                            let input;
    //                            let inputType = dataTag.attr("type").replace("string", "text");
    //                            if (inputType == "select") {
    //                                input = document.createElement("select");
    //                                continue;
    //                            }
    //                            input = document.createElement("input");
    //                            input.setAttribute("type", inputType);
    //                            input.className = "testInput";
    //                            input.value = dataRow[key];
    //                            input.setAttribute("data-bind", "content:" + key);
    //                            if (inputType == "checkbox")
    //                                input.setAttribute("checked", dataRow[key]);
    //                            tdEl.append(input);
    //                        }
    //                        if ($(dataTag).attr("hide") !== undefined) {
    //                            tdEl.style.display = "none";
    //                        }
    //                        tableRow.append(tdEl);
    //                    }
    //                }
    //                dataList[i].rowObj = tableRow;// trObj[0];
    //                dataList[i].visibility = [];

    //                $(tableRow).attr("role", "tableRow");
    //                tbody.append(tableRow);

    //                var inputs = $(tableRow).find("input");
    //                $(inputs).prop("disabled", true);
    //            }
    //        }
    //    }
    //}


    //function checkResizableTables() {

    //    var resizableTables = $('table[isResizable="true"]');
    //    if (resizableTables && resizableTables.length > 0) {

    //        for (i = 0; i < resizableTables.length; i++) {
    //            resizableGrid(resizableTables[i]);
    //        }
    //    }
    //}


    //function checkSortableTables() {

    //    var sortableTables = $('table[sortable="true"]');
    //    if (sortableTables && sortableTables.length > 0) {

    //        for (i = 0; i < sortableTables.length; i++) {

    //            var table = sortableTables[i];
    //            var colHeaders = $(table).find("th");
    //            $(document).on("click", "th", function () {

    //                var sortType = $(this).attr("sortType");
    //                if (!sortType || sortType == "Desc") {
    //                    $(this).attr("sortType", "Asc");
    //                    sortTable($(this).index(), "Asc", table);
    //                }
    //                else {
    //                    $(this).attr("sortType", "Desc");
    //                    sortTable($(this).index(), "Desc", table);
    //                }
    //            });
    //        }
    //    }
    //}


    //function checkFilterableTableColumns() {

    //    if (document.dir == "rtl") {
    //        $(":root").get(0).style.setProperty("--modal-footer-dir", "row");
    //    }

    //    var filterableTables = $('table[filterable="true"]');
    //    if (filterableTables && filterableTables.length > 0) {
    //        for (i = 0; i < filterableTables.length; i++) {

    //            $(filterableTables[i]).css("position", "relative");

    //            //adding filter button
    //            var filterableCols = $(filterableTables[i]).find('th[filterable="true"]');
    //            if (filterableCols && filterableCols.length > 0) {
    //                for (j = 0; j < filterableCols.length; j++) {

    //                    var filterBtn = $('<button class="filterBtn WBbutton" onclick="filterBtnClicked(event,this)" style="font-size:12px;"><span class="icon-filter2"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></span></button>');
    //                    $(filterableCols[j]).find(".headerContent").append(filterBtn);
    //                }
    //            }

    //            let cols = $(filterableTables[i]).find("th");
    //            for (let j = 0; j < cols.length; j++) {

    //                let isFilterable = $(cols[j]).attr("filterable");
    //                if (isFilterable && isFilterable.toLowerCase() == "true") {
    //                    let htmlCnt = '<div class="modal">' +
    //                        '<div class="modal-content">' +
    //                        '<div style="position:relative;">' +
    //                        '<div class="content">' +
    //                        '<div><button class="modalCloseBtn WBbutton icon-close" style="font-size:16px;margin:3px;"></button></div>' +
    //                        '<div class="modal-body">' +
    //                        '</div>' +
    //                        '<div class="modal-footer">' +
    //                        '<button class="applyFilter" onclick="applyFilterClicked(event,this)">' +
    //                        '<div style="display:flex;flex-direction:row;align-items:center;justify-content:center">' +
    //                        '<span style="margin:0px 2px;">Apply</span>' +
    //                        '<span class="icon-filter"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span>' +
    //                        '</div>' +
    //                        '</button>' +
    //                        '<button class="clearFilter" onclick="clearFilterClicked(event,this)">' +
    //                        '<div style="display:flex;flex-direction:row;align-items:center;justify-content:center">' +
    //                        '<span style="margin:0px 2px;">Clear</span>' +
    //                        '<span class="icon-rubbish"></span>' +
    //                        '</div>' +
    //                        '</button></div></div>' +
    //                        '<img class="modal-BG" src="/Images/filter3.svg"/>' +
    //                        '</div>' +
    //                        '</div></div>';
    //                    htmlCnt = $(htmlCnt);
    //                    let innerHtml = $('<div style="display:flex;flex-direction:column;justify-content:right;padding:1px;"></div>');

    //                    let type = $(cols[j]).attr("type");
    //                    let bindingAttr = $(cols[j]).attr("data-bind");

    //                    if (type) {
    //                        type = type.toLowerCase();
    //                        switch (type) {
    //                            case "string":
    //                            case "text":
    //                                $(innerHtml).append('<select class="testInput2"><option>Contains</option><option>Start with</option><option>Ends with</option></select>');
    //                                $(innerHtml).append('<input type="text" class="testInput2" />');
    //                                break;
    //                            case "number":
    //                                $(innerHtml).append('<select class="testInput2"><option>Equals</option><option>Greater than</option><option>Greater than or equal</option><option>Smaller than</option><option>Smaller than or equal</option><option>Between</option></select>');
    //                                $(innerHtml).append('<input type="text" class="from testInput2"/><label class="to betweenOption" style="font-size:13px;">And</label><input type="text" class="to betweenOption testInput2"/>');
    //                                break;
    //                            case "boolean":
    //                                $(innerHtml).append('<span><input type="checkbox" onclick="checkboxOnClick(event,this)" /><label>False</label><input type="checkbox" onclick="checkboxOnClick(event,this)" /><label>True</label></span>');
    //                                break;
    //                            case "combobox":
    //                                $(innerHtml).append('<select class="testInput2" onchange="selectionChanged(this)"><option> </option><option>Option1</option><option>Option2</option><option>Option3</option><option>Option4</option></select>');
    //                                $(innerHtml).append('<label class="selectedItem">...</label>');
    //                                break;
    //                            case "date":
    //                                $(innerHtml).append('<select class="testInput2"><option>Equals</option><option>Greater than</option><option>Smaller than</option><option>Between</option></select>');
    //                                $(innerHtml).append('<input type="text" class="from testInput2" /> <label class="to betweenOption" style="font-size:13px;">And</label> <input type="text" class="to betweenOption testInput2" style="width:100%;" />');
    //                                break;
    //                        }
    //                    }
    //                    //add to parent table
    //                    let modalBody = $(htmlCnt).find(".modal-body");
    //                    $(modalBody[0]).html(innerHtml);
    //                    if (bindingAttr) {
    //                        $(htmlCnt).attr("data-bind", bindingAttr);
    //                    }
    //                    $(filterableTables[i]).append(htmlCnt);

    //                    let modal = htmlCnt[0];
    //                    $(modal).click(function (event) {
    //                        if (event.target == modal) {
    //                            modal.style.display = "none";
    //                        }
    //                    });

    //                    let modalCloseBtn = $(htmlCnt).find(".modalCloseBtn");
    //                    $(modalCloseBtn[0]).click(function () {
    //                        let modalParent = this;
    //                        let isModalParent = $(modalParent).hasClass("modal");
    //                        while (!isModalParent && $(modalParent).prop("tagName").toLowerCase() != "body") {
    //                            modalParent = $(modalParent).parent();
    //                            isModalParent = $(modalParent).hasClass("modal");
    //                        }
    //                        if (isModalParent) {
    //                            $(modalParent).css("display", "none");
    //                        }
    //                    });

    //                    if (type == "number" || type == "date") {
    //                        let selectElement = $(modal).find("select");
    //                        $(selectElement).change(function (obj2) {
    //                            obj2 = obj2.target;
    //                            let selectedIndex = $(obj2).prop("selectedIndex");
    //                            let options = $(obj2).children();
    //                            // console.log($(options[selectedIndex]).text());

    //                            if ($(options[selectedIndex]).text().toLowerCase() == "between") {
    //                                let betweenOptionTags = $(obj2).parent().find(".betweenOption").css("display", "inline");
    //                            }
    //                            else {
    //                                $(obj2).parent().find(".betweenOption").css("display", "none");
    //                            }

    //                            let parentModal = obj2;
    //                            let isModal = $(parentModal).hasClass("modal");
    //                            while (!isModal && $(parentModal).prop("tagName").toLowerCase() != "body") {
    //                                parentModal = $(parentModal).parent();
    //                                isModal = $(parentModal).hasClass("modal");
    //                            }

    //                            let parentTable = obj2;
    //                            let isTable = $(parentTable).prop("tagName").toLowerCase() == "table";

    //                            while (!isTable && $(parentTable).prop("tagName").toLowerCase() != "body") {
    //                                parentTable = $(parentTable).parent();
    //                                isTable = $(parentTable).prop("tagName").toLowerCase() == "table";
    //                            }

    //                            if (isModal) {
    //                                let modalContent = $(parentModal[0]).find(".modal-content");

    //                                if (isTable) {
    //                                    tableLeft = $(parentTable[0]).offset().left;
    //                                    tableWidth = $(parentTable[0]).width();
    //                                    tableRight = screen.width - (tableLeft + tableWidth);

    //                                    let headerLeft = $(cols[j]).offset().left;
    //                                    let headerWidth = $(cols[j]).width();

    //                                    let x = (headerLeft + headerWidth) - tableLeft;

    //                                    modalContentWidth = modalContent[0].offsetWidth;

    //                                    if (x > modalContentWidth) {
    //                                        //place from right side of the column
    //                                        $(modalContent[0]).css("left", ((headerLeft + headerWidth) - modalContentWidth) + "px");
    //                                        $(":root").get(0).style.setProperty("--modal-left", "75%");

    //                                    } else {
    //                                        //place from left side
    //                                        $(modalContent[0]).css("left", (headerLeft) + "px");
    //                                        $(":root").get(0).style.setProperty("--modal-left", "25%");
    //                                    }


    //                                    setTimeout(n => {
    //                                        modalContentWidth = modalContent[0].offsetWidth;
    //                                        if (x > modalContentWidth) {
    //                                            //place from right side of the column
    //                                            $(modalContent[0]).css("left", ((headerLeft + headerWidth) - modalContentWidth) + "px");
    //                                            $(":root").get(0).style.setProperty("--modal-left", "75%");

    //                                        } else {
    //                                            //place from left side
    //                                            $(modalContent[0]).css("left", (headerLeft) + "px");
    //                                            $(":root").get(0).style.setProperty("--modal-left", "25%");
    //                                        }

    //                                    }, 5);

    //                                    //$(modalContent[0]).css("left", tableLeft + ((tableWidth - modalContentWidth) / 2) + "px");
    //                                    //setTimeout(n => {
    //                                    //    modalContentWidth = modalContent[0].offsetWidth;
    //                                    //    $(modalContent[0]).css("left", tableLeft + ((tableWidth - modalContentWidth) / 2) + "px");

    //                                    //}, 5);
    //                                }
    //                            }
    //                        });
    //                    }
    //                }
    //            }
    //        }
    //    }
    //}

    ////sort columns
    //function sortTable(colIndex, sortType, table) {
    //    if (!colIndex || colIndex == 0) {
    //        return;
    //    }

    //    let inEditModeRows = $(table).find('tr[ineditmode="true"]');
    //    if (inEditModeRows && inEditModeRows.length > 0) {
    //        alert("you have unsaved row");
    //        return;
    //    }

    //    var colHeaders = $(table).find("th");
    //    for (j = 1; j < colHeaders.length; j++) {
    //        var col = $(colHeaders[j]).find("span.sortSpan");
    //        if (col.length == 0) {
    //            //$(colHeaders[j]).find(".headerContent").prepend('<span class="sortArrow"><span class="icon-sort-arrows"></span></span>');
    //        }
    //        else {
    //            $(colHeaders[j]).find(".headerContent").find("span.sortSpan").html('<span style="margin:0px 4px;"></span>');
    //        }
    //    }

    //    var thead = $(table).find("thead");
    //    var thArray = $(thead).find("th");
    //    if (sortType == "Asc") {
    //        $(thArray[colIndex]).find(".headerContent").find("span.sortSpan").html('<span class="icon-sort-down"></span>');
    //    }
    //    else if (sortType == "Desc") {
    //        $(thArray[colIndex]).find(".headerContent").find("span.sortSpan").html('<span class="icon-sort-up"></span>');
    //    }

    //    let rows, switching, i, x, y, shouldSwitch;
    //    switching = true;
    //    while (switching) {
    //        switching = false;
    //        rows = $(table).find("tr");
    //        for (i = 1; i < (rows.length - 1); i++) {
    //            shouldSwitch = false;
    //            x = rows[i]
    //                .getElementsByTagName("TD")[colIndex]
    //                .querySelectorAll("[data-bind]")[0].
    //                value.toLowerCase();
    //            y = rows[i + 1]
    //                .getElementsByTagName("TD")[colIndex]
    //                .querySelectorAll("[data-bind]")[0]
    //                .value.toLowerCase();
    //            if (y) {
    //                if (sortType == "Asc") {
    //                    if (x > y) {
    //                        shouldSwitch = true;
    //                        break;
    //                    }
    //                }
    //                else {
    //                    if (x < y) {
    //                        shouldSwitch = true;
    //                        break;
    //                    }
    //                }
    //            }
    //        }
    //        if (shouldSwitch) {
    //            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
    //            switching = true;
    //        }
    //    }
    //}

    ////making resizable columns
    //function resizableGrid(table) {
    //    var row = table.getElementsByTagName('tr')[0],
    //        cols = row ? row.children : undefined;
    //    if (!cols) return;

    //    for (var i = 1; i < cols.length; i++) {
    //        var div = createDiv(table.offsetHeight);
    //        var parDiv = document.createElement("div");
    //        $(parDiv).addClass("resizerParentDiv");
    //        $(div).addClass("resizerChildDiv");
    //        $(cols[i]).prepend(parDiv);
    //        parDiv.appendChild(div);
    //        parDiv.style.position = 'relative';
    //        setListeners(div);
    //    }
    //}

    //function createDiv(height) {
    //    var div = document.createElement('div');
    //    div.style.top = 0;
    //    if (document.dir == "rtl") {
    //        div.style.left = 0;
    //    }
    //    else {
    //        div.style.right = 0;
    //    }

    //    div.style.width = '5px';
    //    div.style.position = 'absolute';
    //    div.style.cursor = 'col-resize';
    //    //div.style.backgroundColor = 'red';
    //    div.style.userSelect = 'none';
    //    div.style.height = height + 'px';
    //    return div;
    //}

    //function setListeners(div) {
    //    var pageX, curCol, nxtCol, curColWidth, nxtColWidth;
    //    div.addEventListener('mousedown', function (e) {
    //        e.stopPropagation();
    //        divPar = e.target.parentElement;
    //        curCol = divPar.parentElement;
    //        nxtCol = curCol.nextElementSibling;
    //        pageX = e.pageX;
    //        curColWidth = curCol.offsetWidth
    //        if (nxtCol)
    //            nxtColWidth = nxtCol.offsetWidth

    //    });

    //    document.addEventListener('mousemove', function (e) {
    //        e.stopPropagation();
    //        if (curCol) {
    //            if (document.dir == "rtl") {
    //                var diffX = pageX - e.pageX;//for dir:Rtl
    //            }
    //            else {
    //                var diffX = e.pageX - pageX; //for dir:Ltr
    //            }

    //            if (diffX > 0 && nxtCol)
    //                nxtCol.style.width = (nxtColWidth - (diffX)) + 'px';

    //            curCol.style.width = (curColWidth + diffX) + 'px';
    //        }
    //    });

    //    document.addEventListener('mouseup', function (e) {
    //        e.stopPropagation();
    //        curCol = undefined;
    //        nxtCol = undefined;
    //        pageX = undefined;
    //        nxtColWidth = undefined;
    //        curColWidth = undefined;
    //    });

    //    div.addEventListener('click', function (e) {
    //        e.stopPropagation();
    //    });
    //}

    //function GetObjectInstanceFromTableRow(rowObj, dataArray) {
    //    result = null;
    //    if (dataArray && dataArray.length > 0) {

    //        for (i = 0; i < dataArray.length; i++) {
    //            if (dataArray[i].rowObj == rowObj) {
    //                result = dataArray[i];
    //                break;
    //            }
    //        }
    //    }
    //    return result;
    //}

    //function StringDataArraySearch(sourceArray, propName, propVal) {

    //    if (sourceArray && sourceArray.length > 0) {
    //        let searchStr = new RegExp(propVal, "i");
    //        for (let i = 0; i < sourceArray.length; i++) {
    //            if (((sourceArray[i][propName]).search(searchStr)) > -1) {
    //                sourceArray[i].visibility[propName] = true;
    //            }
    //            else {
    //                sourceArray[i].visibility[propName] = false;
    //            }
    //        }
    //    }
    //}

    //function NumberDataArraySearch(sourceArray, propName, fromNumber, toNumber, conditionInx) {

    //    if (sourceArray && sourceArray.length > 0) {

    //        if (fromNumber || toNumber) {
    //            switch (conditionInx) {
    //                case 0:
    //                    for (let i = 0; i < sourceArray.length; i++) {
    //                        if ((sourceArray[i][propName]) == fromNumber) {
    //                            sourceArray[i].visibility[propName] = true;
    //                        }
    //                        else {
    //                            sourceArray[i].visibility[propName] = false;
    //                        }
    //                    }
    //                    break;
    //                case 1:
    //                    for (let i = 0; i < sourceArray.length; i++) {
    //                        if ((sourceArray[i][propName]) > fromNumber) {
    //                            sourceArray[i].visibility[propName] = true;
    //                        }
    //                        else {
    //                            sourceArray[i].visibility[propName] = false;
    //                        }
    //                    }
    //                    break;
    //                case 2:
    //                    for (let i = 0; i < sourceArray.length; i++) {
    //                        if ((sourceArray[i][propName]) > fromNumber || (sourceArray[i][propName]) == fromNumber) {
    //                            sourceArray[i].visibility[propName] = true;
    //                        }
    //                        else {
    //                            sourceArray[i].visibility[propName] = false;
    //                        }
    //                    }
    //                    break;
    //                case 3:
    //                    for (let i = 0; i < sourceArray.length; i++) {
    //                        if ((sourceArray[i][propName]) < fromNumber) {
    //                            sourceArray[i].visibility[propName] = true;
    //                        }
    //                        else {
    //                            sourceArray[i].visibility[propName] = false;
    //                        }
    //                    }
    //                    break;
    //                case 4:
    //                    for (let i = 0; i < sourceArray.length; i++) {
    //                        if ((sourceArray[i][propName]) < fromNumber || (sourceArray[i][propName]) == fromNumber) {
    //                            sourceArray[i].visibility[propName] = true;
    //                        }
    //                        else {
    //                            sourceArray[i].visibility[propName] = false;
    //                        }
    //                    }
    //                    break;
    //                case 5:
    //                    for (let i = 0; i < sourceArray.length; i++) {
    //                        if ((sourceArray[i][propName]) > fromNumber && (sourceArray[i][propName]) < toNumber) {
    //                            sourceArray[i].visibility[propName] = true;
    //                        }
    //                        else {
    //                            sourceArray[i].visibility[propName] = false;
    //                        }
    //                    }
    //                    break;
    //            }
    //        }
    //        else {
    //            for (let i = 0; i < sourceArray.length; i++) {
    //                sourceArray[i].visibility[propName] = true;
    //            }
    //        }
    //    }
    //}

    //function BooleanDataArraySearch(sourceArray, propName, trueCheckbox, falseCheckbox) {

    //    if (sourceArray && sourceArray.length > 0) {

    //        if ((trueCheckbox && falseCheckbox) || (!trueCheckbox && !falseCheckbox)) {
    //            for (let i = 0; i < sourceArray.length; i++) {
    //                sourceArray[i].visibility[propName] = true;
    //            }
    //        }
    //        else if (trueCheckbox) {
    //            // trueCheckbox && !falseCheckbox
    //            for (let i = 0; i < sourceArray.length; i++) {
    //                if (sourceArray[i][propName] == true) {
    //                    sourceArray[i].visibility[propName] = true;
    //                }
    //                else {
    //                    sourceArray[i].visibility[propName] = false;
    //                }
    //            }
    //        }
    //        else {
    //            // !trueCheckbox && falseCheckbox
    //            for (let i = 0; i < sourceArray.length; i++) {
    //                if (sourceArray[i][propName] == false) {
    //                    sourceArray[i].visibility[propName] = true;
    //                }
    //                else {
    //                    sourceArray[i].visibility[propName] = false;
    //                }
    //            }
    //        }
    //    }
    //}

    //function DateDataArraySearch(sourceArray, propName, fromDate, toDate, conditionInx) {

    //    if (sourceArray && sourceArray.length > 0) {

    //        if (fromDate || toDate) {
    //            let date1 = new Date(fromDate).getTime();
    //            let date2 = new Date(toDate);
    //            switch (conditionInx) {
    //                case 0:
    //                    for (let i = 0; i < sourceArray.length; i++) {
    //                        let tempDate = new Date(sourceArray[i][propName]).getTime();
    //                        if (tempDate == date1) {
    //                            sourceArray[i].visibility[propName] = true;
    //                        }
    //                        else {
    //                            sourceArray[i].visibility[propName] = false;
    //                        }
    //                    }
    //                    break;
    //                case 1:
    //                    for (let i = 0; i < sourceArray.length; i++) {
    //                        let tempDate = new Date(sourceArray[i][propName]);
    //                        if (tempDate > date1) {
    //                            sourceArray[i].visibility[propName] = true;
    //                        }
    //                        else {
    //                            sourceArray[i].visibility[propName] = false;
    //                        }
    //                    }
    //                    break;
    //                case 2:
    //                    for (let i = 0; i < sourceArray.length; i++) {
    //                        let tempDate = new Date(sourceArray[i][propName]);
    //                        if (tempDate < date1) {
    //                            sourceArray[i].visibility[propName] = true;
    //                        }
    //                        else {
    //                            sourceArray[i].visibility[propName] = false;
    //                        }
    //                    }
    //                    break;
    //                case 3:
    //                    for (let i = 0; i < sourceArray.length; i++) {
    //                        let tempDate = new Date(sourceArray[i][propName]);
    //                        if (tempDate > date1 && tempDate < date2) {
    //                            sourceArray[i].visibility[propName] = true;
    //                        }
    //                        else {
    //                            sourceArray[i].visibility[propName] = false;
    //                        }
    //                    }
    //                    break;
    //            }
    //        }
    //        else {
    //            for (let i = 0; i < sourceArray.length; i++) {
    //                sourceArray[i].visibility[propName] = true;
    //            }
    //        }
    //    }

    //}

    //function ValidateNumber(relatedTag, propVal) {
    //    // let numRegExp = /^[0-9]+\.?[0-9]*$/;
    //    // let numRegExp = /^\d*$/;
    //    let numRegExp = /^[0-9]+$/;
    //    if (numRegExp.test(propVal)) {
    //        $(relatedTag).removeClass("invalid");
    //        return true;
    //    }
    //    else {
    //        $(relatedTag).addClass("invalid");
    //        return false;
    //    }
    //}

    //function ValidateString(relatedTag, propVal) {
    //    //let strRegExp = /^[^\\\/&]*$/;
    //    let strRegExp = /^[a-zA-Z0-9]+$/;
    //    if (strRegExp.test(propVal)) {
    //        $(relatedTag).removeClass("invalid");
    //        return true;
    //    }
    //    else {
    //        $(relatedTag).addClass("invalid");
    //        return false;
    //    }
    //}

    //function ValidateDate(relatedTag, propVal, typeOfDate) {
    //    let isValid = false;
    //    if (typeOfDate == "gregorian") {
    //        let dateRegExp = /^(19|20)\d{2}\/(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])$/;
    //        if (dateRegExp) {
    //            if (dateRegExp.test(propVal)) {
    //                isValid = true;
    //            }
    //            else {
    //                isValid = false;
    //            }
    //        }
    //    }
    //    else if (typeOfDate == "shamsi") {
    //        let dateArr = propVal.split('/');
    //        if (dateArr.length == 3) {
    //            let shamsiDate = new ShamsiDate(dateArr[0], dateArr[1], dateArr[2]);
    //            isValid = shamsiDate.Validate();
    //        }
    //        else {
    //            isValid = false;
    //        }
    //    }

    //    if (isValid) {
    //        $(relatedTag).removeClass("invalid");
    //        return true;
    //    }
    //    else {
    //        $(relatedTag).addClass("invalid");
    //        return false;
    //    }
    //}
}