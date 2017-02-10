using System;
using System.IO;
using System.Net;
using System.Web;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Configuration;
using System.Collections.Generic;

namespace HttpBabylon
{
    public static class Application
    {
        private static bool Started = false;
        public static void Start()
        {
            if (Started) return;
            Started = true;
            try
            {
                HttpApplication.RegisterModule(typeof(HttpBabylonModule));
            }
            catch (Exception ex)
            {
                Console.WriteLine(String.Format("===> Http Babylon Module Error: {0}", ex.Message));
            }
        }
        public static int TransmitPacketSize
        {
            get
            {
                int packets = 1024 * 32;
                if (transmitPacketSize == null)
                {
                    lock (transmitPacketSizeLock)
                    {
                        if (transmitPacketSize == null)
                        {
                            try
                            {
                                if (WebConfigurationManager.AppSettings["TransmitPacketSize"] != null)
                                {
                                    string data = WebConfigurationManager.AppSettings["TransmitPacketSize"];
                                    transmitPacketSize = (!String.IsNullOrEmpty(data)) ? Int32.Parse(data) : packets;
                                }
                            }
                            catch
                            {
                                transmitPacketSize = packets;
                            }
                        }
                    }
                }
                if (transmitPacketSize == null)
                {
                    transmitPacketSize = packets;
                }
                return transmitPacketSize.Value;
            }
        }
        private static int? transmitPacketSize = null;
        private static readonly object transmitPacketSizeLock = new object();
        //
        // Streaming Copy Helper
        //
        public static void CopyTo(this Stream source, Stream destination, bool finalFlush = false, int bufferSize = 4096, long maxCount = -1)
        {
            byte[] buffer = new byte[bufferSize];
            long totalBytesWritten = 0;
            while (true)
            {
                int count = buffer.Length;
                if (maxCount > 0)
                {
                    if (totalBytesWritten > maxCount - count)
                    {
                        count = (int)(maxCount - totalBytesWritten);
                        if (count <= 0)
                        {
                            break;
                        }
                    }
                }
                int read = source.Read(buffer, 0, count);
                if (read <= 0)
                {
                    break;
                }
                destination.Write(buffer, 0, read);
                totalBytesWritten += read;
            }
            if (finalFlush)
            {
                try { destination.Flush(); } catch { }
            }
        }
    }
    //
    // BabylonJS Scene File Http Module (Static File Handler)
    //
    internal class HttpBabylonModule : IHttpModule
    {
        public void Init(HttpApplication application)
        {
            application.PreRequestHandlerExecute += (object sender, EventArgs e) =>
            {
                HttpContext context = application.Context;
                if (!String.IsNullOrEmpty(context.Request.CurrentExecutionFilePathExtension) && context.Request.CurrentExecutionFilePathExtension.Equals(".babylon", StringComparison.OrdinalIgnoreCase))
                {
                    string serverPath = context.Request.PhysicalApplicationPath;
                    string babylonPath = context.Request.CurrentExecutionFilePath;
                    string babylonFile = serverPath.Replace("\\", "/").TrimEnd('/') + "/" + babylonPath.TrimStart('/');
                    FileInfo info = new FileInfo(babylonFile);
                    if (info.Exists)
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.OK;
                        context.Response.ContentType = "application/babylon";
                        WriteBabylonResponse(context, info);
                        application.CompleteRequest();
                    }
                }
            };
        }

        public void WriteBabylonResponse(HttpContext context, FileInfo path)
        {
            FileInfo info = path;
            // Support Pre-Compressed Babylon Scene Files
            if (info.Extension.Equals(".babylon", StringComparison.OrdinalIgnoreCase))
            {
                string RpcContentEncoding = context.Request.Headers["Accept-Encoding"] ?? "none";
                if (RpcContentEncoding.Contains("gzip"))
                {
                    string gzipFile = info.FullName + ".gz";
                    if (File.Exists(gzipFile))
                    {
                        context.Response.Headers.Add("Content-Encoding", "gzip");
                        info = new FileInfo(gzipFile);
                    }
                }
            }
            Stream file = info.OpenRead();
            WriteBabylonResponse(context, file);
            file.Close();
        }

        public void WriteBabylonResponse(HttpContext context, Stream stream)
        {
            Stream output = context.Response.OutputStream;
            context.Response.Headers.Add("Content-Payload", "babylon");
            context.Response.Headers.Add("Content-Length", stream.Length.ToString());
            stream.CopyTo(output, true, HttpBabylon.Application.TransmitPacketSize);
            output.Close();
        }

        public void Dispose() { }
        public string ModuleName { get { return "HttpBabylon"; } }
    }
}
