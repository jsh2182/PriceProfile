function printReport(fileName, data, element) {
    let report = new Stimulsoft.Report.StiReport();
    report.loadFile(fileName);
    let dataSet = new Stimulsoft.System.Data.DataSet("PriceProfile");
    dataSet.readJson(data);
    report.regData(dataSet.dataSetName, "", dataSet);
    let viewer = new Stimulsoft.Viewer.StiViewer();
    viewer.report = report;
    viewer.renderHTML(element)

}