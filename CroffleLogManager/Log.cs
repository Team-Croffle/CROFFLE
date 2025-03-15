using NLog;
using NLog.Config;
using NLog.Targets;

namespace CroffleLogManager
{
    // All the code in this file is included in all platforms.
    public class Log
    {
        private static Logger? _logger = null;

        public Log() { _logger = LogManager.GetCurrentClassLogger(); }

        public static void SetConfig(string fileName)
        {
            LoggingConfiguration config = new();

            var fileTarget = new FileTarget("logfile")
            {
                FileName = fileName,
                Layout = "[${longdate} - ${level}] ${message}"
            };

            var logConsole = new ConsoleTarget("logconsole")
            {
                Layout = "[${longdate} - ${level}] ${message}"
            };

            config.AddRule(LogLevel.Info, LogLevel.Fatal, fileTarget);
            config.AddRule(LogLevel.Debug, LogLevel.Fatal, logConsole);

            LogManager.Configuration = config;

            _logger = LogManager.GetCurrentClassLogger();
        } // SetConfig

        public static void LogDebug(string message)
        {
            if (_logger != null) _logger.Debug(message);
        } // LogDebug
        public static void LogInfo(string message)
        {
            if (_logger != null) _logger.Info(message);
        } // LogInfo
        public static void LogWarn(string message)
        {
            if (_logger != null) _logger.Warn(message);
        } // LogWarn
        public static void LogError(string message)
        {
            if (_logger != null) _logger.Error(message);
        } // LogError
        public static void LogFatal(string message)
        {
            if (_logger != null) _logger.Fatal(message);
        } // LogFatal

    } // Log
} // CroffleLogManager
