# Venus EMS — Website

Website tĩnh (HTML/CSS/JS thuần), không cần build. Deploy thẳng lên Vercel.

## Cấu trúc

```
index.html        Bố cục trang (6 mục trình chiếu + cổng vào)
style.css         Toàn bộ giao diện
data.js           Nội dung: Discord, giới thiệu, cấp bậc, nội quy, quy trình cứu hộ, tuyển dụng
main.js           Hiệu ứng, trình chiếu, thư viện nội quy, tra cứu Ctrl K
logo.webp, favicon.png, og.png
vercel.json       Cấu hình Vercel
```

## Sửa nội dung

Mọi chữ trên trang nằm trong `data.js`:

- **Link Discord:** `discord`
- **Cấp bậc:** `ranks` (thêm `boss: true` cho cấp cao nhất để có vương miện)
- **Nội quy:** `rules` — mỗi chương có `t` (tên), `d` (mô tả ngắn), `items` (các điều).
  Chữ cần nhấn mạnh bọc trong `<em>…</em>`. Số điều tự đánh liên tục giữa các chương.
  Chương có `scale: true` hiển thị dạng thang mức độ, nhãn mức đặt trong `levels`.
- **Quy trình cứu hộ:** `flow`; **phân loại bệnh nhân:** `codes`
- **Lộ trình gia nhập:** `join`

Tra cứu Ctrl K tự lấy dữ liệu từ nội quy, cấp bậc, quy trình, phân loại và giới thiệu — không cần sửa gì thêm.

## Điều khiển

- Cuộn chuột / vuốt: chạm cuối mục sẽ chuyển sang mục tiếp theo
- Phím ← → chuyển mục, ↑ ↓ cuộn trong mục, Home / End về đầu / cuối
- Ctrl K hoặc / để tra cứu

## Chạy thử trên máy

Mở thẳng `index.html` bằng trình duyệt là chạy.

## Deploy

1. Tạo repo GitHub, đẩy toàn bộ thư mục này lên.
2. Vào vercel.com → Add New → Project → chọn repo.
3. Framework Preset: **Other**. Build Command để trống. Output Directory để trống.
4. Deploy.
