export default async function handler(req, res) {
  // Zalo Webhook gửi dữ liệu qua phương thức POST
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { event_name, user_id, timestamp } = req.body;

    // Xử lý sự kiện người dùng rút quyền dữ liệu hoặc xóa app
    if (event_name === "user_pdl_revoke") {
      console.log(`Người dùng ${user_id} đã yêu cầu xóa dữ liệu lúc ${timestamp}`);
      // Thực hiện logic xóa user khỏi database của bạn tại đây
    }

    // Luôn trả về 200 nhanh nhất có thể để xác nhận với Zalo
    return res.status(200).json({ processed: true });
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(200).send("OK"); // Vẫn trả về 200 để tránh Zalo retry liên tục
  }
}