// Every string the scripts write into the page, in English and Vietnamese.
// Text that is already in index.html uses .en/.vi elements or data-tl attributes instead.
export const T = {
  en: {
    title: 'Quan Minh Nguyen, Principal Software Engineer',
    tip: 'Click to show', hiddenName: 'Hidden name. Click to show it.',
    lockShow: 'Show hidden details', lockHide: 'Hide details again. They also hide by themselves after {m} minutes without activity.',
    autoLocked: 'Client names are hidden again after {m} minutes without activity.',
    themeDark: 'Switch to dark mode', themeLight: 'Switch to light mode',
    go: 'Show details', checking: 'Checking…', six: 'Enter all 6 digits.',
    wrong: 'That code didn\'t work. Ask for a fresh one.', left: function (n) { return n + (n === 1 ? ' try left.' : ' tries left.'); },
    tooMany: function (s) { return 'Too many wrong codes. Try again in ' + (s > 5400 ? Math.round(s / 3600) + ' hours.' : Math.ceil(s / 60) + ' minutes.'); },
    offline: 'The code service didn\'t answer. Check your connection and try again.',
    cvNotYet: '<strong>The PDF isn\'t published yet.</strong><span>Email me and I\'ll send it.</span><a class="btn" href="mailto:nmquan2504@gmail.com">Email me</a>',
    cvLocked: '<strong>This version is locked.</strong><span>It includes client names and my phone number.</span><button class="btn primary" data-unlock>Enter a code</button>',
    cvNoFull: '<strong>The full PDF isn\'t in the vault yet.</strong>',
    cvPublicName: 'CV.pdf', cvFullName: 'CV (full).pdf', cvPublicTitle: 'CV, public version', cvFullTitle: 'CV, full version',
    help: 'Commands\n  whoami          who I am\n  projects        selected projects and their results\n  experience      roles, years and main projects\n  skills          skills by area\n  contact         email and GitHub\n  cv              open the CV\n  ask <question>  ask the AI assistant about Quan\n  unlock          enter a code to show client names\n  lock            hide client names again\n  lang vi | en    switch language\n  open <window>   about, projects, experience, skills, cv, chat\n  version         site version and build time\n  clear           clear the screen',
    whoami: 'Quan Minh Nguyen\nPrincipal Software Engineer, KMS Solutions\nHo Chi Minh City, Vietnam',
    opening: 'Opening ', noWin: 'No window called ', notFound: function (c) { return 'zsh: command not found: ' + c + '. Type help.'; },
    already1: 'Already showing everything.', enter: 'Enter the 6-digit code in the dialog.', already0: 'Already hidden.', hidden: 'Client names are hidden again.',
    intro: 'Type help to see what you can ask.', login: 'Last login: ', hiddenMark: '[hidden]',
    built: 'Built', builtTz: '(Ho Chi Minh City time)',
    devBuild: 'Local build: no version stamp. Deployed builds get one from the publish workflow.',
    noVersion: 'Could not read the version file.',
    chatThinking: 'Thinking…', chatTooLong: 'Keep questions under 500 characters.',
    chatTooMany: function (s) {
      if (s <= 90) return 'You\'re asking a bit fast. Wait ' + s + ' seconds, then ask again.';
      return 'That\'s the question limit for now. Try again in ' + (s > 5400 ? Math.round(s / 3600) + ' hours' : Math.ceil(s / 60) + ' minutes') + ', or call Quan at 0907 944 718.';
    },
    chatOffline: 'The assistant didn\'t answer. Check your connection, or call Quan at 0907 944 718.',
    lead: { contact: 'Leave your details and Quan will get back to you.', demo: 'Leave your details to book a demo.', hire: 'Leave your details and Quan will get back to you about the role.' },
    leadName: 'Your name', leadReach: 'Email or phone', leadMsg: 'Message (optional)', leadSend: 'Send to Quan', leadSending: 'Sending…',
    leadSent: 'Sent. Quan will get back to you soon.', leadAgain: 'Your details are already with Quan.',
    leadBad: 'Add your name and a valid email or phone number.',
    leadTooMany: 'Too many requests today. Call Quan at 0907 944 718 instead.',
    leadFail: 'Couldn\'t send it. Call Quan at 0907 944 718 or email nmquan2504@gmail.com.'
  },
  vi: {
    title: 'Quan Minh Nguyen, Principal Software Engineer',
    tip: 'Bấm để xem', hiddenName: 'Tên đã được ẩn. Bấm để xem.',
    lockShow: 'Xem thông tin bị ẩn', lockHide: 'Ẩn lại thông tin. Thông tin cũng tự ẩn sau {m} phút không thao tác.',
    autoLocked: 'Tên khách hàng đã được ẩn lại sau {m} phút không thao tác.',
    themeDark: 'Chuyển sang giao diện tối', themeLight: 'Chuyển sang giao diện sáng',
    go: 'Xem', checking: 'Đang kiểm tra…', six: 'Hãy nhập đủ 6 số.',
    wrong: 'Mã không đúng. Hãy xin mã mới.', left: function (n) { return 'Còn ' + n + ' lần thử.'; },
    tooMany: function (s) { return 'Nhập sai quá nhiều lần. Thử lại sau ' + (s > 5400 ? Math.round(s / 3600) + ' giờ.' : Math.ceil(s / 60) + ' phút.'); },
    offline: 'Dịch vụ kiểm tra mã không phản hồi. Hãy kiểm tra kết nối mạng rồi thử lại.',
    cvNotYet: '<strong>Bản PDF chưa được đăng lên.</strong><span>Gửi email cho tôi, tôi sẽ gửi CV cho bạn.</span><a class="btn" href="mailto:nmquan2504@gmail.com">Gửi email</a>',
    cvLocked: '<strong>Bản này đang bị khoá.</strong><span>Trong đó có tên khách hàng và số điện thoại của tôi.</span><button class="btn primary" data-unlock>Nhập mã</button>',
    cvNoFull: '<strong>Bản PDF đầy đủ chưa có trong kho lưu trữ.</strong>',
    cvPublicName: 'CV.pdf', cvFullName: 'CV (đầy đủ).pdf', cvPublicTitle: 'CV, bản công khai', cvFullTitle: 'CV, bản đầy đủ',
    help: 'Các lệnh\n  whoami          tôi là ai\n  projects        các dự án tiêu biểu và kết quả\n  experience      vị trí, thời gian và dự án chính\n  skills          kỹ năng theo từng mảng\n  contact         email và GitHub\n  cv              mở CV\n  ask <câu hỏi>   hỏi trợ lý AI về Quan\n  unlock          nhập mã để hiện tên khách hàng\n  lock            ẩn lại tên khách hàng\n  lang vi | en    đổi ngôn ngữ\n  open <cửa sổ>   about, projects, experience, skills, cv, chat\n  version         phiên bản site và thời gian build\n  clear           xoá màn hình',
    whoami: 'Quan Minh Nguyen\nPrincipal Software Engineer, KMS Solutions\nTP. Hồ Chí Minh, Việt Nam',
    opening: 'Đang mở ', noWin: 'Không có cửa sổ nào tên ', notFound: function (c) { return 'zsh: không tìm thấy lệnh: ' + c + '. Gõ help để xem các lệnh.'; },
    already1: 'Mọi thông tin đã được hiện.', enter: 'Nhập mã 6 số vào hộp thoại.', already0: 'Thông tin đang được ẩn.', hidden: 'Đã ẩn lại tên khách hàng.',
    intro: 'Gõ help để xem các lệnh có thể dùng.', login: 'Lần đăng nhập cuối: ', hiddenMark: '[ẩn]',
    built: 'Build lúc', builtTz: '(giờ TP. Hồ Chí Minh)',
    devBuild: 'Bản chạy local: chưa có số phiên bản. Bản deploy sẽ được workflow publish gắn phiên bản.',
    noVersion: 'Không đọc được file phiên bản.',
    chatThinking: 'Đang trả lời…', chatTooLong: 'Câu hỏi tối đa 500 ký tự.',
    chatTooMany: function (s) {
      if (s <= 90) return 'Bạn hỏi hơi nhanh. Chờ ' + s + ' giây rồi hỏi tiếp nhé.';
      return 'Bạn đã hỏi đủ số câu cho phép lúc này. Thử lại sau ' + (s > 5400 ? Math.round(s / 3600) + ' giờ' : Math.ceil(s / 60) + ' phút') + ', hoặc gọi Quan qua số 0907 944 718.';
    },
    chatOffline: 'Trợ lý không phản hồi. Hãy kiểm tra kết nối mạng, hoặc gọi Quan qua số 0907 944 718.',
    lead: { contact: 'Để lại thông tin, Quan sẽ liên hệ lại với bạn.', demo: 'Để lại thông tin để hẹn lịch xem demo.', hire: 'Để lại thông tin, Quan sẽ liên hệ lại về công việc.' },
    leadName: 'Tên của bạn', leadReach: 'Email hoặc số điện thoại', leadMsg: 'Lời nhắn (không bắt buộc)', leadSend: 'Gửi cho Quan', leadSending: 'Đang gửi…',
    leadSent: 'Đã gửi. Quan sẽ sớm liên hệ lại với bạn.', leadAgain: 'Quan đã nhận được thông tin của bạn.',
    leadBad: 'Hãy nhập tên và email hoặc số điện thoại hợp lệ.',
    leadTooMany: 'Hôm nay đã gửi quá nhiều lần. Bạn hãy gọi Quan qua số 0907 944 718.',
    leadFail: 'Chưa gửi được. Bạn hãy gọi Quan qua số 0907 944 718 hoặc email nmquan2504@gmail.com.'
  }
};
