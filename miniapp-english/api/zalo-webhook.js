export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  const { phoneToken } = req.body;
  const SECRET_KEY = process.env.ZALO_SECRET_KEY;

  try {
    const zaloRes = await fetch("https://graph.zalo.me/v2.0/me/info-by-access-token", {
      method: "GET",
      headers: {
        "secret_key": SECRET_KEY,
        "token": phoneToken // Đây là token từ getPhoneNumber gửi lên
      }
    });

    const data = await zaloRes.json();

    if (data.error) {
      return res.status(400).json({ success: false, message: data.message, raw: data });
    }

    return res.status(200).json({
      success: true,
      user: { phone: data.data.number } // Zalo trả về number trong object data
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
console.log("TOKEN:", phoneToken.slice(0, 10));
