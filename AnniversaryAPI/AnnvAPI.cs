/***
  Copyright 2024 Croffle Development Team (WKU - CSE)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
***/

using System.Data;
using System.Runtime.InteropServices;
using System.Xml;
using CroffleDataManager.SQLiteDB;
using HttpManager;

namespace AnniversaryAPI
{
    public class AnnvAPI
    {
        // API Key by data.go.kr - Korea Astronomy and Space Science Institute (KASI) Special Day Information
        // https://www.data.go.kr/data/15012690/openapi.do
        private string apiKey = "";
        private string baseUrl = "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/";

        DBManager dbManager;
        HttpConn httpConn;

        Dictionary<AnnvType, string> dictionary = new Dictionary<AnnvType, string>
        {
            { AnnvType.Anniversary, "getAnniversaryInfo" },
            { AnnvType.Holidays, "getHoliDeInfo" },
            { AnnvType.RestDays, "getRestDeInfo" },
            { AnnvType._24Divisions, "get24DivisionsInfo" },
            { AnnvType.SundryDays, "getSundryDayInfo" }
        };

        [DllImport("DBFileManager.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern void initializeAnnvDB(string dbname);
        [DllImport("DBFileManager.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern void createAnnvDB(string dbname);

        public AnnvAPI()
        {
            dbManager = new DBManager("annv.sql");
            httpConn = new HttpConn();
        } // AnnvAPI()

        public AnnvAPI(string apiKey) : this()
        {
            if (apiKey == null)
            {
                Console.WriteLine("[AnnvAPI] API Key is null");
                throw new ArgumentNullException("[AnnvAPI] API Key is null");
            }
            this.apiKey = apiKey;
        }


        public void CheckAnnv()
        {
            var tables = new List<string> { "anniversary" };
            Console.WriteLine("[AnnvAPI] Check SQLiteDB");
            var res = dbManager.CheckValidation(tables);
            if (res == 0)
            {
                Console.WriteLine("> [AnnvAPI] SQLiteDB is invalid");
                throw new TaskCanceledException("[AnnvAPI] SQLiteDB is invalid");
            }
            else if (res == -1)
            {
                Console.WriteLine("> [AnnvAPI] SQLiteDB is not exist");
                throw new DirectoryNotFoundException("[AnnvAPI] SQLiteDB is not exist");
            }
            Console.WriteLine("[AnnvAPI] SQLiteDB is valid");
        } // CheckAnnvValidation()

        public string GetDirPath()
        {
            return dbManager.GetDirPath();
        }

        public string GetFullPath()
        {
            return dbManager.GetFullPath();
        }
        public string GetDB_Version()
        {
            dbManager.SelectFrom("version", "db_version", "name='current'", null, out DataSet dataSet);
            return dataSet.Tables[0].Rows[0][0].ToString() ?? throw new NullReferenceException(" >[GetFullPath] sNo Version");
        }

        public void CheckAnniversaryMonth(int year, int moneth)
        {
            Console.WriteLine($@"[AnnvAPI] CheckAnniversaryMonth: {year}.{moneth}");
            dbManager.SelectFrom("*", "anniversary", $@"locdate LIKE '{year:D4}-{moneth:D2}-%'", null, out DataSet dataSet);
            
            ValidateTableCount(dataSet, "Check Annv");

            var table = dataSet.Tables[0];
            if (table.Rows.Count == 0)
            {
               Console.WriteLine("> [CheckAnniversaryMonth] No data in DB");
                SetEveryAnniversaryOnDB(year, moneth);
            }
            else
            {
                Console.WriteLine("> [CheckAnniversaryMonth] Data exist in DB");
            }
        }

        public void SetEveryAnniversaryOnDB(int year, int month)
        {
            XmlDocument xmlDoc = new XmlDocument();

            Console.WriteLine($@"[AnnvAPI] Set On DB {year}.{month}");
            var data = GetAnniversary(apiKey, year, month, AnnvType.Anniversary);
            SetOnDB(data);

            data = GetAnniversary(apiKey, year, month, AnnvType.RestDays);
            SetOnDB(data);

            data = GetAnniversary(apiKey, year, month, AnnvType.Holidays);
            SetOnDB(data);

            data = GetAnniversary(apiKey, year, month, AnnvType._24Divisions);
            SetOnDB(data);

            data = GetAnniversary(apiKey, year, month, AnnvType.SundryDays);
            SetOnDB(data);

            Console.WriteLine("[AnnvAPI] SetEveryAnniversaryOnDB done.");
        }

        public void GetDailyInfo(DateTime locdate, out DataTable? table)
        {
            Console.WriteLine($@"[AnnvAPI] GetDailyInfo: {locdate.ToString("yyyy-MM-dd")}");
            dbManager.SelectFrom("*", "anniversary", $@"locdate=date('{locdate.ToString("yyyy-MM-dd")}')", null, out DataSet dataSet);
            
            ValidateTableCount(dataSet, "Get Annv");

            table = dataSet.Tables[0];
            if (table.Rows == null) table = null;
        }

        private string GetAnniversary(string serviceKey, int year, int month, AnnvType type)
        {
            Console.WriteLine($@"> [GetAnniversary] Set {type.ToString()}");
            var target = dictionary[type];
            var url = $@"{baseUrl}{target}?serviceKey={serviceKey}&pageNo=1&numOfRows=100&solYear={year}&solMonth={month.ToString("D2")}";
            var res = httpConn.GetDataGET(url, out string data);
            if (res != 1)
            {
                Console.WriteLine("> [GetAnniversary] failed: http Error");
                throw new TaskCanceledException("[GetAnniversary] failed: http Error");
            }
            return data;
        } // GetAnnvData()

        private void SetOnDB(string data)
        {
            XmlDocument xmlDoc = new XmlDocument();
            if(data == null)
            {
                Console.WriteLine("> [SetOnDB] failed: data is null");
                return;
            }
            xmlDoc.LoadXml(data);
            XmlNodeList xmlist = xmlDoc.GetElementsByTagName("resultCode");
            XmlNode xmlist0 = xmlist[0] ?? throw new NullReferenceException(" > [SetOnDB] No resultCode");
            if (xmlist.Count == 0)
            {
                xmlist = xmlDoc.GetElementsByTagName("errMsg");
                Console.WriteLine($"> [SetOnDB] failed: {xmlist0.InnerText}");
                throw new TaskCanceledException($"[SetOnDB] failed: {xmlist0.InnerText}");
            }

            if (xmlist0.InnerText != "00")
            {
                Console.WriteLine($"> [SetOnDB] failed: {xmlist0.InnerText}");
                throw new TaskCanceledException($"[SetOnDB] failed: Error Code: {xmlist0.InnerText}");
            }

            xmlist = xmlDoc.GetElementsByTagName("item");
            foreach (XmlNode xn in xmlist)
            {
                XmlElement temp = xn["locdate"] ?? throw new NullReferenceException(" > [SetOnDB] No locdate");
                string xmldate = temp.InnerText;
                string conv_date = DateTime.ParseExact(xmldate, "yyyyMMdd", null).ToString("yyyy-MM-dd");
                temp = xn["isHoliday"] ?? throw new NullReferenceException(" > [SetOnDB] No isHoliday");
                bool isHoliday = temp.InnerText == "Y" ? true : false;
                temp = xn["dateName"] ?? throw new NullReferenceException(" > [SetOnDB] No dateName");
                string dateName = temp.InnerText;
                dbManager.ReplaceInto("anniversary", $@"date('{conv_date}'), {isHoliday}, '{dateName}' ");
            }
            Console.WriteLine("> [SetOnDB] Save Done.");
        }
        
        /// <summary>
         /// 반환된 DataSet의 Table의 validation을 확인합니다.
         /// </summary>
         /// <param name="dataSet">dataset</param>
         /// <param name="context">table 명</param>
         /// <exception cref="NullReferenceException">table 없음</exception>
         /// <exception cref="ConstraintException">table이 많음</exception>
        private void ValidateTableCount(DataSet dataSet, string context)
        {
            if (dataSet.Tables.Count == 0)
            {
                Console.WriteLine($"> [{context}] No tables in DataSet");
                throw new NullReferenceException($"No tables in DataSet");
            }
            else if (dataSet.Tables.Count > 1)
            {
                Console.WriteLine($"> [{context}] Too many tables in DataSet");
                throw new ConstraintException($"Too many tables in DataSet");
            }
            Console.WriteLine($"> [{context}] Table is valid");
        }

    } // class AnnvAPI

    internal enum AnnvType
    {
        Anniversary,
        Holidays,
        RestDays,
        _24Divisions,
        SundryDays,
    }
} // namespace AnniversaryAPI
