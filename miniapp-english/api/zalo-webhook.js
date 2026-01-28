export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { phoneToken, name } = req.body;

  if (!phoneToken) {
    return res.status(400).json({
      success: false,
      message: "Thiếu phoneToken"
    });
  }

  try {
    const APP_ID = process.env.ZALO_APP_ID;
    const APP_SECRET = process.env.ZALO_SECRET_KEY;

    if (!APP_ID || !APP_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Chưa cấu hình ZALO_APP_ID hoặc ZALO_SECRET_KEY"
      });
    }

    const zaloRes = await fetch(
      "https://graph.zalo.me/v2.0/me/info",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          access_token: phoneToken,
          app_id: APP_ID,
          app_secret: APP_SECRET
        })
      }
    );

    const data = await zaloRes.json();

    if (!data.phone) {
      return res.status(400).json({
        success: false,
        message: "Token không hợp lệ hoặc hết hạn",
        raw: data
      });
    }

    // 👉 TẠI ĐÂY: lưu CRM / DB / gửi webhook / tracking

    return res.status(200).json({
      success: true,
      user: {
        name,
        phone: data.phone
      }
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}
console.log("TOKEN:", phoneToken.slice(0, 10));
