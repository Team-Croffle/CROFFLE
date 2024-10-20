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

using System;
using System.IO;

namespace CroffleDataManager
{
    public class FileManager
    {
        public string FilePath { get; }
        public string FileName { get; }

        public FileManager(string? path, string? file_name)
        {
            FilePath = path ?? "";
            FileName = file_name ?? "";
        }//FileManager()

        public bool CheckFile()
        {
            return File.Exists(GetFullPath());
        }//CheckFile()

        public void CreateFile()
        {
            string fullPath = Path.Combine(FilePath, FileName);
            using (File.Create(fullPath)) { }
        }//CreateFile()

        public void DeleteFile()
        {
            string fullPath = Path.Combine(FilePath, FileName);
            File.Delete(fullPath);
        }// DeleteFile()

        public string GetFullPath()
        {
            return Path.Combine(FilePath, FileName);
        }//GetFullPath()

        public string ReadAllText()
        {
            var result = string.Empty;
            try
            {
                result = File.ReadAllText(GetFullPath());
            }
            catch (FileNotFoundException)
            {
                Console.WriteLine("[FileManager] ReadAllText: File Not Found");
                return string.Empty;
            }
            catch (IOException)
            {
                Console.WriteLine("[FileManager] ReadAllText: IO Error");
                return string.Empty;
            }
            return result;
        }//ReadAllText()

        public void WriteText(string text)
        {
            try
            {
                File.WriteAllText(GetFullPath(), text);
            }
            catch (FileNotFoundException)
            {
                Console.WriteLine("[FileManager] WriteText: File Not Found");
            }
            catch (IOException)
            {
                Console.WriteLine("[FileManager] WriteText: IO Error");
            }
        }//WriteText()
    }//class FileManager
}//namespace CroffleDataManager
