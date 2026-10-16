/* =========================================================
   NỘI DUNG — chỉ cần sửa trong DATA
   Chữ nhấn mạnh trong nội quy: bọc bằng <em>…</em>
   ========================================================= */
var DATA = {
  discord: 'https://discord.gg/',

  introText: 'Venus EMS là lực lượng y tế khẩn cấp của Venus World — cứu hộ, sơ cứu, chữa trị và chăm sóc người dân 24/7.',
  values: ['Nhanh chóng', 'Tận tâm', 'An toàn'],
  vow: 'Mỗi ca cứu hộ là một sinh mạng. Đến nhanh, làm đúng, chăm sóc bằng cả trái tim.',
  vowBy: 'Trưởng khoa Venus EMS',
  joinText: 'Theo dõi kênh Discord của Venus EMS để nhận thông báo các đợt tuyển dụng mới.',
  ticker: ['Nhanh chóng', 'Tận tâm', 'An toàn', 'Venus EMS 24/7'],

  intro: [
    { t: 'Cứu hộ',   d: 'Có mặt nhanh nhất tại hiện trường, sơ cứu và đưa người bị thương về viện an toàn.', i: 'amb' },
    { t: 'Chữa trị', d: 'Khám, điều trị và hồi sức cho người dân tại bệnh viện và trạm cứu thương.', i: 'kit' },
    { t: 'Phối hợp', d: 'Làm việc cùng Cảnh sát và Chính Phủ trong mọi tình huống khẩn cấp của thành phố.', i: 'hand' }
  ],

  ranks: [
    { g: 0, n: 'Recruit',   vn: 'Thực tập sinh',        p: 'Đi cùng nhân viên hướng dẫn, học sơ cứu cơ bản.' },
    { g: 1, n: 'Paramedic', vn: 'Nhân viên cứu thương', p: 'Nhận cuộc gọi, sơ cứu và chở bệnh nhân.' },
    { g: 2, n: 'Doctor',    vn: 'Bác sĩ',               p: 'Điều trị, hồi sức và hướng dẫn nhân viên mới.' },
    { g: 3, n: 'Surgeon',   vn: 'Bác sĩ phẫu thuật',    p: 'Xử lý ca nặng, điều phối ca trực.' },
    { g: 4, n: 'Chief',     vn: 'Trưởng khoa',          p: 'Quản lý EMS, tuyển dụng và khen thưởng.', boss: true }
  ],
  criteria: [
    { t: 'Thời gian trực', i: 'clock' },
    { t: 'Số ca cứu hộ', i: 'amb' },
    { t: 'Đánh giá của Trưởng khoa', i: 'star' }
  ],

  /* scale: true → hiển thị dạng thang mức độ (dùng cho chương kỷ luật) */
  rules: [
    { t: 'Quy định chung', d: 'Quy định áp dụng cho mọi nhân viên EMS trong ca trực.', items: [
      'Bật trạng thái <em>on duty</em> trước khi làm việc và tắt khi rời ca.',
      'Mặc đúng đồng phục EMS, đeo vòng tay và mang thẻ ngành khi trực.',
      'Luôn lịch sự, nhẹ nhàng với bệnh nhân và người nhà.',
      'Không dùng xe cứu thương, thuốc hay trang bị cho việc riêng.'
    ]},
    { t: 'Khi cứu hộ', d: 'Cách làm việc tại hiện trường và trên đường cứu hộ.', items: [
      'Ưu tiên ca nặng trước, báo tình trạng qua bộ đàm khi đến nơi.',
      'Chỉ vào hiện trường đang giao tranh khi <em>đã an toàn</em> hoặc có Cảnh sát hỗ trợ.',
      'Không bỏ bệnh nhân giữa chừng khi chưa có người tiếp nhận.',
      'Bật còi và đèn ưu tiên chỉ khi đang làm nhiệm vụ khẩn cấp.'
    ]},
    { t: 'Trung lập', d: 'EMS phục vụ tất cả người dân như nhau.', items: [
      'EMS cứu tất cả mọi người, <em>không đứng về phe nào</em>.',
      'Không tham gia giao tranh, không mang vũ khí khi đang trực.',
      'Không tiết lộ thông tin bệnh nhân cho người ngoài.'
    ]},
    { t: 'Xử lý kỷ luật', d: 'Mức xử lý tăng dần theo mức độ vi phạm.', scale: true, levels: ['Mức nhẹ', 'Lặp lại', 'Nghiêm trọng'], items: [
      'Vi phạm nhẹ: <em>nhắc nhở</em> hoặc <em>cảnh cáo</em>.',
      'Vi phạm lặp lại: <em>đình chỉ</em> có thời hạn hoặc <em>giáng cấp</em>.',
      'Lạm dụng quyền hạn, tiếp tay phạm tội: <em>sa thải</em> khỏi EMS.'
    ]}
  ],

  flow: [
    { t: 'Nhận cuộc gọi', d: 'Xác nhận ca qua bộ đàm, nắm vị trí và tình trạng.', i: 'phone' },
    { t: 'Di chuyển',     d: 'Lên xe cứu thương, bật ưu tiên và đến nơi an toàn.', i: 'amb' },
    { t: 'Sơ cứu',        d: 'Kiểm tra, cầm máu, hồi sức tại hiện trường.', i: 'kit' },
    { t: 'Về viện',       d: 'Đưa bệnh nhân về viện, bàn giao và hoàn tất hồ sơ.', i: 'bed' }
  ],
  codes: [
    { c: 'Đỏ',   d: 'Nguy kịch, cần xử lý ngay',   k: 'red', spd: '1.1s' },
    { c: 'Vàng', d: 'Bị thương, cần chăm sóc sớm', k: 'yel', spd: '2s' },
    { c: 'Xanh', d: 'Nhẹ, có thể chờ',             k: 'grn', spd: '3.4s' }
  ],

  join: [
    { t: 'Theo dõi Discord',   d: 'Tham gia kênh Discord Venus EMS.' },
    { t: 'Chờ thông báo',      d: 'Nhận thông báo khi mở đợt tuyển dụng mới.' },
    { t: 'Bắt đầu từ Recruit', d: 'Khởi đầu với cấp Thực tập sinh, đi cùng nhân viên hướng dẫn.' }
  ]
};
