function toggl2gcal() {
    /*
     * note
     - toggleでの実績をGoogleカレンダーに反映させるスクリプト
     - トリガーを指定して、実行タイミングを制御して利用する
     - 本サンプルは、toggl側の「プロジェクト名」で予定を作成するスクリプト
     -- 「タスク名」で作りたい場合は要修正
     */
    function toggl2gcal() {
        var Toggl = {
            BASIC_AUTH: '[TOGGL_API_TOKEN]:api_token', // FIXME: 自分のtogglのapi_tokenを指定
            get: function (path) {
                var url = 'https://www.toggl.com/api/v8' + path;
                var options = {
                    'method': 'GET',
                    'headers': {
                        "Authorization": "Basic " + Utilities.base64Encode(this.BASIC_AUTH)
                    }
                }
                var response = UrlFetchApp.fetch(url, options);
                return JSON.parse(response);
            },
            getTimeEntries: function () {
                var path = '/time_entries'
                return this.get(path)
            },
            getTimeEntry: function (id) {
                var path = '/time_entries/' + id
                return this.get(path);
            },
            getProject: function (id) {
                var path = '/projects/' + id
                return this.get(path);
            },
            getTimeEntriesAt: function (startDatetime, endDatetime) {
                var path = '/time_entries?start_date=' + startDatetime + '&end_date=' + endDatetime
                return this.get(path);
            }
        }

        var myCal = CalendarApp.getCalendarById('[GCAL_CALENDER_ID]'); // FIXME: 自分のカレンダーのidを指定
        var now = new Date();
        var yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

        // 前日分のTimeEntriesを対象とする
        var startDatetimeForToggl = Utilities.formatDate(yesterday, 'Asia/Tokyo', 'yyyy-MM-dd') + 'T00%3A00%3A00%2B09%3A00';
        var endDatetimeForToggl = Utilities.formatDate(yesterday, 'Asia/Tokyo', 'yyyy-MM-dd') + 'T23%3A59%3A59%2B09%3A00';
        var timeEntries = Toggl.getTimeEntriesAt(startDatetimeForToggl, endDatetimeForToggl)

        // timeEntry毎にループ
        for (var n = 0; n <= timeEntries.length - 1; n++) {
            timeEntry = timeEntries[n]
            var startDatetime = timeEntry.start
            var endDatetime = timeEntry.stop
            var projectName = Toggl.getProject(timeEntry.pid).data.name
            // var taskName = timeEntry.description FIXME: タスク名で予定を作りたい場合はこちらを利用
            myCal.createEvent(projectName, new Date(startDatetime), new Date(endDatetime), option)
        }
    }
}
