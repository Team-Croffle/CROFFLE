using CroffleLogManager;

namespace DataManager
{
    // All the code in this file is included in all platforms.
    public class FileManager
    {
        public FileInfo _file { get; private set; }

        public FileManager(string path, string fileName)
        {
            _file = new FileInfo(Path.Combine(path, fileName));
            if (!_file.Directory?.Exists ?? false) _file.Directory?.Create();
            if (!_file.Exists) _file.Create().Close();
        } // FileManager

        public string ReadAllText()
        {
            var text = string.Empty;
            try
            {
                text = File.ReadAllText(_file.FullName);
            }
            catch (FileNotFoundException)
            {
                Log.LogError($@"[FileManager] ReadAllText: File not found. {_file.FullName}");
                return string.Empty;
            }
            catch (IOException)
            {
                Log.LogError($@"[FileManager] ReadAllText: IO Error. {_file.FullName}");
                return string.Empty;
            }
            return text;
        } // ReadAllText

        public void WriteAllText(string text)
        {
            try
            {
                File.WriteAllText(_file.FullName, text);
            }
            catch (FileNotFoundException)
            {
                Log.LogError($@"[FileManager] ReadAllText: File not found. {_file.FullName}");
            }
            catch (IOException)
            {
                Log.LogError($@"[FileManager] WriteAllText: IO Error. {_file.FullName}");
            }
        } // WriteAllText
    } // FileManager
} // DataManager
