export default async function handler(req, res) {
  // Chỉ chấp nhận method POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { phoneToken, name } = req.body;

  if (!phoneToken) {
    return res.status(400).json({ success: false, message: 'Thiếu Token Zalo' });
  }

  try {
    // Lấy Secret Key từ cấu hình Vercel (Bước 2 sẽ làm cái này)
    const SECRET_KEY = process.env.ZALO_SECRET_KEY; 
    
    if (!SECRET_KEY) {
      return res.status(500).json({ success: false, message: "Chưa cấu hình Secret Key" });
    }

    // GỌI SANG ZALO ĐỂ LẤY SỐ ĐIỆN THOẠI THẬT
    const zaloResponse = await fetch("https://graph.zalo.me/v2.0/me/info", {
      method: "GET",
      headers: {
        "access_token": phoneToken,
        "secret_key": SECRET_KEY
      }
    });

    const data = await zaloResponse.json();

    if (data.error) {
      return res.status(500).json({ success: false, message: "Token lỗi hoặc hết hạn" });
    }

    // LẤY ĐƯỢC SỐ ĐIỆN THOẠI
    const realPhoneNumber = data.data.number; 
    
    // Trả về cho Web
    return res.status(200).json({ 
      success: true, 
      user: {
        name: name,
        phone: realPhoneNumber
      }
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}