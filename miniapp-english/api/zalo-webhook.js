export default async function handler(req, res) {
  // 1. Chỉ chấp nhận phương thức POST từ Zalo
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const data = req.body;
    const { event_name, user_id, timestamp } = data;

    // 2. Xử lý sự kiện người dùng rút quyền/xóa dữ liệu (user_pdl_revoke)
    if (event_name === "user_pdl_revoke") {
      console.log(`[Zalo Webhook] User ${user_id} đã rút quyền dữ liệu.`);
      
      // Gửi thông báo này lên Google Sheet để cập nhật trạng thái nếu cần
      await sendWebhookLogToSheet({
        user_id,
        event: event_name,
        time: new Date(timestamp * 1000).toISOString(),
        note: "Người dùng đã gỡ Mini App hoặc hủy quyền."
      });
    }

    // 3. Luôn phản hồi 200 OK cho Zalo nhanh nhất có thể
    return res.status(200).json({ success: true, message: "Webhook received" });
  } catch (err) {
    console.error("Webhook Error:", err.message);
    // Vẫn trả về 200 để tránh Zalo retry liên tục gây treo server
    return res.status(200).send("Error Handled");
  }
}

// Hàm phụ để đẩy log sự kiện lên Google Sheet (Tương tự hàm sendDataToGoogleSheet của bạn)
async function sendWebhookLogToSheet(logData) {
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/.../exec';
  const formData = new FormData();
  formData.append("value", "Zalo Webhook Event");
  formData.append("ghi_chu", `${logData.event}: ${logData.user_id} - ${logData.note}`);
  
  try {
    await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', body: formData });
  } catch (e) {
    console.error("Lỗi log webhook:", e);
  }
} 