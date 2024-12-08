using System.Security.Cryptography;
using System.Text;

namespace NetReportBuilder.ReportUI.Models
{
    public class BaseEntity
    {
        public int Id { get; set; }
        public string EncId { get { return DESEncrypt.Encrypt(Id.ToString()); } }
    }
    public class DESEncrypt
    {
        private static string DESKey = "nsis_desencrypt_2019";

        #region ========encryption========
        /// <summary>
        /// encryption
        /// </summary>
        /// <param name="Text"></param>
        /// <returns></returns>
        public static string Encrypt(string Text)
        {
            if (Text == null || Text.Trim() == string.Empty)
            {
                return string.Empty;
            }
            return Encrypt(Text, DESKey);
        }
        /// <summary> 
        /// Encrypted data 
        /// </summary> 
        /// <param name="Text"></param> 
        /// <param name="sKey"></param> 
        /// <returns></returns> 
        public static string Encrypt(string Text, string sKey)
        {
            DESCryptoServiceProvider des = new DESCryptoServiceProvider();
            byte[] inputByteArray;
            inputByteArray = Encoding.Default.GetBytes(Text);
            des.Key = ASCIIEncoding.ASCII.GetBytes(Md5Hash.Md5(sKey, 32).Substring(0, 8));
            des.IV = ASCIIEncoding.ASCII.GetBytes(Md5Hash.Md5(sKey, 32).Substring(0, 8));
            System.IO.MemoryStream ms = new System.IO.MemoryStream();
            CryptoStream cs = new CryptoStream(ms, des.CreateEncryptor(), CryptoStreamMode.Write);
            cs.Write(inputByteArray, 0, inputByteArray.Length);
            cs.FlushFinalBlock();
            StringBuilder ret = new StringBuilder();
            foreach (byte b in ms.ToArray())
            {
                ret.AppendFormat("{0:X2}", b);
            }
            return ret.ToString();
        }

        #endregion

        #region ========Decrypt========
        /// <summary>
        /// Decrypt
        /// </summary>
        /// <param name="Text"></param>
        /// <returns></returns>
        public static string Decrypt(string Text)
        {
            if (!string.IsNullOrEmpty(Text))
            {
                return Decrypt(Text, DESKey);
            }
            else
            {
                return "";
            }
        }
        /// <summary> 
        /// Decrypt data 
        /// </summary> 
        /// <param name="Text"></param> 
        /// <param name="sKey"></param> 
        /// <returns></returns> 
        public static string Decrypt(string Text, string sKey)
        {
            if (Text == "css")
            {
                return string.Empty;
            }
            DESCryptoServiceProvider des = new DESCryptoServiceProvider();
            int len;
            len = Text.Length / 2;
            byte[] inputByteArray = new byte[len];
            int x, i;
            for (x = 0; x < len; x++)
            {
                i = Convert.ToInt32(Text.Substring(x * 2, 2), 16);
                inputByteArray[x] = (byte)i;
            }
            des.Key = ASCIIEncoding.ASCII.GetBytes(Md5Hash.Md5(sKey, 32).Substring(0, 8));
            des.IV = ASCIIEncoding.ASCII.GetBytes(Md5Hash.Md5(sKey, 32).Substring(0, 8));
            System.IO.MemoryStream ms = new System.IO.MemoryStream();
            CryptoStream cs = new CryptoStream(ms, des.CreateDecryptor(), CryptoStreamMode.Write);
            cs.Write(inputByteArray, 0, inputByteArray.Length);
            cs.FlushFinalBlock();
            return Encoding.Default.GetString(ms.ToArray());
        }

        #endregion
    }
    public class Md5Hash
    {
        /// <summary>
        /// MD5 encryption
        /// </summary>
        /// <param name="str">Encrypted character</param>
        /// <param name="code">Encrypted digits 16/32</param>
        /// <returns></returns>
        public static string Md5(string str, int code)
        {
            byte[] bytes;
            using (var md5 = MD5.Create())
            {
                bytes = md5.ComputeHash(Encoding.UTF8.GetBytes(str));
            }

            var result = new StringBuilder();
            foreach (byte t in bytes)
            {
                result.Append(t.ToString("X2"));
            }
            if (code == 16)
            {
                return result.ToString().Substring(8, 16);
            }
            return result.ToString();
        }
    }
    public class SHA512Hash
    {

        public static string SHa512(string str)
        {
            SHA512 sha512 = SHA512Managed.Create();
            byte[] bytes = Encoding.UTF8.GetBytes(str);
            byte[] hash = sha512.ComputeHash(bytes);
            return GetStringFromHash(hash);
        }
        private static string GetStringFromHash(byte[] hash)
        {
            StringBuilder result = new StringBuilder();
            for (int i = 0; i < hash.Length; i++)
            {
                result.Append(hash[i].ToString("X2"));
            }
            return result.ToString();
        }
    }
}
