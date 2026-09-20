/* ==========================================================================
   HERITAGE CIRCUIT — internationalisation (VIE / EN)
   Shared translation layer for the login and store pages.

   How it works
   ------------
   • Text that should translate carries a data-i18n="key" attribute; the
     element's textContent is swapped for the string in the active language.
   • Input placeholders use data-i18n-placeholder="key".
   • The <title> and any other special strings live under keys read directly.
   • The chosen language is stored in localStorage (key hc_lang) so it carries
     across every page in the flow, and defaults to Vietnamese.

   Load this AFTER js/app.js and BEFORE the page-specific script, so page
   scripts can call HeritageI18n.t(...) for dynamic strings.
   ========================================================================== */

const HeritageI18n = (function () {

  const STORAGE_KEY = 'hc_lang';
  const DEFAULT_LANG = 'vi';           // Vietnamese first
  const SUPPORTED = ['vi', 'en'];

  /* ---- translation dictionaries ----
     Keys are namespaced by page (login.* / store.*) so a single shared
     dictionary can drive every page without collisions. Proper names such
     as "Nhật Bình", "Giao Lĩnh", "Ngũ Thân" and the brand are intentionally
     left untranslated. */
  const DICT = {
    vi: {
      /* login */
      'login.title': 'Heritage Circuit — Đăng Nhập',
      'login.h1': 'Chào Mừng Trở Lại',
      'login.quote': '“Di sản không phải để cất giữ, mà để mặc lên người.”',
      'login.emailLabel': 'Email hoặc tên đăng nhập',
      'login.emailPlaceholder': 'Email',
      'login.passwordLabel': 'Mật khẩu',
      'login.passwordPlaceholder': 'Mật khẩu',
      'login.remember': 'Ghi nhớ đăng nhập',
      'login.forgot': 'Quên mật khẩu?',
      'login.submit': 'Đăng Nhập',
      'login.welcome': 'Chào mừng ✓',
      'login.or': 'hoặc',
      'login.newHere': 'Bạn mới đến?',
      'login.createAccount': 'Tạo tài khoản',
      'login.footer': 'HERITAGE CIRCUIT — CỔ PHỤC VIỆT, MAY MỚI TỪNG ĐƯỜNG KIM',

      /* store */
      'store.title': 'Heritage Circuit — Bộ Sưu Tập',
      'store.menuQueue': '🥽 Hàng chờ Trải nghiệm',
      'store.menuTicket': '🎟️ Vé vào cửa',
      'store.eyebrow': 'Di Sản, Cách Tân',
      'store.h1': 'Bộ Sưu Tập',
      'store.intro': 'Ba trang phục được phục chế, cách tân bởi các thợ dệt truyền thống lâu nghề hợp tác cùng Heritage Circuit.',
      'store.catNhatBinh': 'Triều phục nhà Nguyễn',
      'store.catGiaoLinh': 'Áo giao lĩnh cổ chéo',
      'store.catNguThan': 'Áo ngũ thân năm tà',
      'store.sub': 'Bấm vào thẻ để truy cập trang.',
      'store.footer': 'HERITAGE CIRCUIT — THỔI HỒN MÁY MÓC, THẮP SÁNG DI SẢN',

      /* shared footers */
      'common.footerMachine': 'HERITAGE CIRCUIT — THỔI HỒN MÁY MÓC, THẮP SÁNG DI SẢN',
      'common.footerTailor': 'HERITAGE CIRCUIT — CỔ PHỤC VIỆT, MAY MỚI TỪNG ĐƯỜNG KIM',

      /* rules / terms */
      'rules.title': 'Heritage Circuit — Điều Khoản Dịch Vụ',
      'rules.eyebrow': 'Chính Sách & Quy Định',
      'rules.h1': 'Điều Khoản Dịch Vụ',
      'rules.s1title': '1. Quy Trình Đặt Hàng & Thanh Toán',
      'rules.s1body': 'Mỗi sản phẩm đều được may theo đơn đặt hàng — không có hàng may sẵn trong kho. Khoản đặt cọc 30% xác nhận vị trí của bạn trong hàng chờ xưởng may; phần còn lại thanh toán khi sản phẩm hoàn thành, trước khi giao.',
      'rules.s2title': '2. Lấy Số Đo & Điều Chỉnh',
      'rules.s2body': 'Sản phẩm may đo được cắt theo số đo bạn cung cấp sau khi đặt hàng. Yêu cầu điều chỉnh sau khi đã bắt đầu cắt vải có thể phát sinh phí tùy theo mức độ hoàn thiện của sản phẩm.',
      'rules.s3title': '3. Chất Liệu & Bảo Quản',
      'rules.s3body': 'Chỉ giặt tay bằng nước lạnh hoặc giặt khô — giặt máy sẽ làm hỏng thuốc nhuộm tự nhiên và thêu tay. Phơi ngang nơi tránh ánh nắng trực tiếp, và cất gấp cùng giấy lụa không axit thay vì treo móc.',
      'rules.s4title': '4. Chính Sách Đổi Trả & Huỷ Đơn',
      'rules.s4body': 'Vì mỗi sản phẩm được may riêng cho bạn, chúng tôi không thể nhận đổi trả vì lý do kích cỡ hay sở thích sau khi hoàn thành. Ngoại lệ duy nhất là lỗi tay nghề thực sự, được bảo hành trong vòng 7 ngày kể từ khi giao hàng.',
      'rules.s5title': '5. Bản Quyền & Sở Hữu Trí Tuệ',
      'rules.s5body': 'Mỗi kiểu dáng là bản tái hiện của riêng chúng tôi dựa trên phom trang phục truyền thống Việt Nam. Hình ảnh, mô tả và hoa văn thêu trên trang này thuộc về Heritage Circuit và không được sao chép hay bán lại.',
      'rules.agree': 'Tôi Đồng Ý',
      'rules.agreed': 'Đã đồng ý ✓',

      /* entry ticket */
      'entry.title': 'Heritage Circuit — Vé Vào Cửa',
      'entry.eyebrow': 'Heritage Circuit',
      'entry.h1': 'Vé Vào Cửa Của Bạn',
      'entry.viet': 'Xuất trình vé này tại cửa vào toà nhà',
      'entry.ticketTitle': 'Vé Vào Toà Nhà',
      'entry.admit': 'Vào Cửa Một Người',
      'entry.guestLabel': 'Khách',
      'entry.idLabel': 'Mã Vé',
      'entry.scan': 'Quét mã tại lối vào',
      'entry.continue': 'Tiếp Tục Đến Trang Chính',

      /* queue */
      'queue.title': 'Heritage Circuit — Hàng Chờ',
      'queue.topTitle': 'Hàng Chờ Trải Nghiệm VR',
      'queue.vrTitle': 'Bước Vào Trải Nghiệm',
      'queue.vrText': 'Bước qua cánh cửa thời gian với trải nghiệm thực tế ảo (VR) đa giác quan đỉnh cao, nơi bạn có thể tự do dạo bước qua các di tích lịch sử cổ kính, hòa mình vào đời sống thường nhật thời cổ đại và chiêm ngưỡng những bộ y phục lộng lẫy được tái hiện tinh xảo. Đặc biệt, hệ thống mô phỏng giác quan tiên tiến sẽ đánh thức mọi cảm xúc của bạn qua từng làn gió thoảng, sự thay đổi chân thực của nhiệt độ cùng những hương thơm phảng phất trong không gian, mang lại một hành trình nhập vai vượt thời gian sống động và chân thật nhất.',
      'queue.h1': 'Tham Gia Trải Nghiệm',
      'queue.viet': 'Đăng ký, chọn quầy, nhận vé tham gia trải nghiệm thực tế ảo đắm chìm',
      'queue.step1': 'Đăng Ký',
      'queue.registerText': 'Đăng ký để tham gia hàng chờ quầy.',
      'queue.registerBtn': 'Đăng Ký Hàng Chờ',
      'queue.step2': 'Chọn Quầy',
      'queue.boothText': 'Hãy bấm chọn một quầy trống.',
      'queue.legendEmpty': 'Trống',
      'queue.legendOccupied': 'Đã có người',
      'queue.step3': 'Chọn Trang Phục & Tạo Vé',
      'queue.step3Text': 'Chọn trang phục cho lượt trải nghiệm tại quầy này, rồi tạo vé của bạn.',
      'queue.continue': 'Tiếp Tục',
      'queue.boothName': 'Quầy VR',
      'queue.boothWord': 'Quầy',
      'queue.alreadyReg': 'Bạn đã đăng ký rồi',
      'queue.registeredPos': 'Đã đăng ký — vị trí #{n} trong hàng',
      'queue.registeredToast': 'Đã đăng ký — vị trí #{n}',
      'queue.boothOccupied': 'Quầy {n} đã có người — hãy chọn quầy trống',
      'queue.chooseFirst': 'Hãy chọn một quầy trống trước',

      /* generate ticket */
      'generate.title': 'Heritage Circuit — Tạo Vé',
      'generate.eyebrow': 'Heritage Circuit',
      'generate.h1': 'Tạo Vé',
      'generate.viet': 'Tuỳ chỉnh trang phục của bạn',
      'generate.outfitLabel': 'Trang Phục',
      'generate.select': 'Chọn...',
      'generate.previewOutfit': 'Chọn một trang phục để xem trước tại đây',
      'generate.noOutfit': 'Chưa chọn trang phục',
      'generate.sizeLabel': 'Kích Cỡ',
      'generate.colorLabel': 'Màu Sắc',
      'generate.formLabel': 'Kiểu Dáng',
      'generate.formFemale': 'Nữ',
      'generate.formMale': 'Nam',
      'generate.settingLabel': 'Bối Cảnh VR',
      'generate.previewSetting': 'Chọn một bối cảnh để xem trước tại đây',
      'generate.noSetting': 'Chưa chọn bối cảnh',
      'generate.sumOutfit': 'Trang phục:',
      'generate.sumSize': 'Kích cỡ:',
      'generate.sumColor': 'Màu sắc:',
      'generate.sumForm': 'Kiểu dáng:',
      'generate.sumSetting': 'Bối cảnh VR:',
      'generate.unset': 'Chưa chọn',
      'generate.qrLabel': 'Vé QR Của Bạn',
      'generate.qrDesc': 'Xuất trình mã này tại quầy',
      'generate.timeframe': 'Khung giờ',
      'generate.openBooth': 'Mở trang Booth để quét',
      'generate.boothNote': 'Quầy {n} — {name}',
      'generate.noBoothNote': 'Chưa chọn quầy — hãy quay lại trang Hàng Chờ trước',
      'generate.chooseBoothFirst': 'Hãy chọn quầy từ trang Hàng Chờ trước',
      'generate.selectAll': 'Vui lòng chọn tất cả các mục trước',
      'generate.ticketGenerated': 'Đã tạo vé',

      /* product — shared */
      'product.tapHint': 'Chạm vào một mục để mở',
      'product.info': 'Thông Tin',
      'product.stock': 'Tồn Kho',
      'product.material': 'Chất Liệu',
      'product.back': 'Quay lại',
      'product.tagHeritage': 'Di Sản',
      'product.tagAvailability': 'Tồn Kho',
      'product.tagMaterial': 'Chất Liệu',
      'product.onHand': 'Có Sẵn',
      'product.bySize': 'Theo Kích Cỡ',
      'product.refChart': 'Bảng Tham Chiếu',
      'product.fabric': 'Vải',
      'product.thSize': 'Cỡ',
      'product.thChest': 'Ngực',
      'product.thLength': 'Dài',
      'product.thSleeve': 'Tay áo',

      /* product — Nhật Bình */
      'pNhat.title': 'Heritage Circuit — Nhật Bình Phượng Hoàng',
      'pNhat.heroViet': 'Áo Nhật Bình gấm đỏ thêu phượng',
      'pNhat.heroSub': 'Bản tái hiện uy nghi của triều phục nhà Nguyễn, thêu tay hoa văn phượng trên gấm lụa cao cấp.',
      'pNhat.navInfo': 'Triều phục nhà Nguyễn · lịch sử',
      'pNhat.navStock': '18 sản phẩm · may theo đơn',
      'pNhat.navMaterial': 'Gấm lụa · chỉ kim tuyến',
      'pNhat.li1': 'Nhật Bình là lễ phục cung đình của hoàng hậu, công chúa và các bậc nữ quyền quý triều Nguyễn, được mặc từ thế kỷ 19 đến đầu thế kỷ 20.',
      'pNhat.li2': 'Tên gọi bắt nguồn từ chiếc cổ áo vuông phía trước — cổ vuông — nhìn thẳng phẳng phiu như chữ “nhật” (mặt trời).',
      'pNhat.li3': 'Màu sắc thể hiện phẩm cấp nơi cung đình: vàng tươi dành riêng cho hoàng hậu, đỏ cho công chúa và các phi tần cao cấp, tím và xanh dành cho các bậc thấp hơn.',
      'pNhat.li4': 'Các hoa văn hình tròn trên ngực và lưng được thêu hình phượng — biểu tượng nữ giới, đối xứng với hình rồng dành riêng cho long bào của nhà vua.',
      'pNhat.li5': 'Chiếc khăn vành đội kèm được quấn từ một dải vải dài, vành khăn phía sau xuôi nhẹ như vầng trăng khuyết.',
      'pNhat.li6': 'Bản tái hiện này giữ lại cổ áo và hoa văn phượng thêu tay, được may cho cô dâu hiện đại và dịp lễ thay vì nghi thức cung đình thường nhật.',
      'pNhat.onHandText': 'sản phẩm hoàn thiện tại xưởng thêu Huế',
      'pNhat.stockNote': 'Mỗi cổ áo được thêu tay theo đơn, nên thời gian thực hiện khoảng 3–5 tuần sau khi chốt kích cỡ.',
      'pNhat.chipS': 'S · còn 2',
      'pNhat.chipXL': 'XL · còn 3',
      'pNhat.fabricText': 'Gấm lụa cho thân áo, lót sau cổ bằng vải pha bông-lụa dệt dày để giữ phom.',
      'pNhat.embLabel': 'Thêu',
      'pNhat.embText': 'Cổ áo và hoa văn tròn được thêu tay bằng chỉ kim tuyến và chỉ tơ, theo mô típ phượng truyền thống của lễ phục nữ giới cung đình.',
      'pNhat.sw1': 'Gấm đỏ hoàng gia',
      'pNhat.sw2': 'Viền cổ màu chàm',
      'pNhat.sw3': 'Chỉ kim tuyến',

      /* product — Giao Lĩnh */
      'pGiao.title': 'Heritage Circuit — Giao Lĩnh Lục Trúc',
      'pGiao.heroViet': 'Áo giao lĩnh lụa xanh lá, dáng trúc biếc',
      'pGiao.heroSub': 'Áo giao lĩnh nhuộm lá trà xanh, dáng rộng cho những buổi chiều thong dong nơi khóm trúc.',
      'pGiao.navInfo': 'Áo giao lĩnh · lịch sử',
      'pGiao.navStock': '24 sản phẩm · nhuộm theo mẻ',
      'pGiao.navMaterial': 'Lụa · nhuộm lá trà',
      'pGiao.li1': 'Giao lĩnh (交領, “cổ chéo”) là một trong những phom trang phục Việt cổ xưa nhất được ghi nhận, được cả nam lẫn nữ mặc ít nhất từ thời Lý–Trần trở đi.',
      'pGiao.li2': 'Đặc trưng của áo là chiếc cổ: hai vạt trước bắt chéo trước ngực thành hình chữ V, vạt trái đè lên vạt phải, rồi buộc bằng đai thay vì cài khuy.',
      'pGiao.li3': 'Bản thường ngày dùng tay áo mỏng không lót, còn bản lễ nghi dùng tay áo rộng và nặng như chiếc này, để vải rủ thành nếp mềm khi buông tay.',
      'pGiao.li4': 'Vì áo mở phía trước, theo truyền thống bên trong mặc một lớp áo lót nhạt màu, lộ ra ở cổ và gấu áo — vẻ hai tông màu dịu nhẹ được giữ lại trong bản tái hiện này.',
      'pGiao.li5': 'Phom áo cổ chéo ra đời sớm và ảnh hưởng trực tiếp đến kimono Nhật Bản và hanbok Hàn Quốc, tất cả cùng bắt nguồn từ truyền thống cổ chéo chung khắp Đông Á và Đông Nam Á.',
      'pGiao.li6': 'Sản phẩm này làm nhẹ chất vải truyền thống và nhuộm bằng lá trà xanh, hợp cho chụp ảnh ngoài trời và nghi lễ ban ngày hơn là lễ phục cung đình.',
      'pGiao.onHandText': 'sản phẩm từ mẻ nhuộm lá trà hiện tại',
      'pGiao.stockNote': 'Độ đậm màu thay đổi đôi chút giữa các mẻ, vì sắc màu đến trực tiếp từ lá trà dùng trong tuần đó.',
      'pGiao.chipS': 'S · còn 4',
      'pGiao.chipXL': 'XL · còn 2',
      'pGiao.fabricText': 'Lụa tơ tằm mềm cho áo ngoài, phối cùng lớp lụa lót màu ngà nhẹ hơn, lộ ra ở cổ, cửa tay và gấu áo.',
      'pGiao.dyeLabel': 'Nhuộm & viền',
      'pGiao.dyeText': 'Màu áo đến từ bồn nhuộm lá trà xanh, cho sắc xanh trầm hơi ấm thay vì màu xanh tổng hợp phẳng lì.',
      'pGiao.sw1': 'Xanh trà trầm',
      'pGiao.sw2': 'Lớp lót màu ngà',
      'pGiao.sw3': 'Đai màu trúc vàng',

      /* product — Ngũ Thân */
      'pNgu.title': 'Heritage Circuit — Ngũ Thân Vân Lam',
      'pNgu.heroViet': 'Áo ngũ thân voan lam, phối chân váy kem',
      'pNgu.heroSub': 'Áo ngũ thân voan lam mờ, khoác ngoài chân váy màu ngà theo phom rộng xưa.',
      'pNgu.navInfo': 'Áo ngũ thân · lịch sử',
      'pNgu.navStock': '15 sản phẩm · may theo đơn',
      'pNgu.navMaterial': 'Voan lụa · viền ngọc trai',
      'pNgu.li1': 'Áo ngũ thân, “áo năm tà,” là trang phục ngoài trang trọng phổ biến cho cả nam lẫn nữ ở Việt Nam từ thế kỷ 18 trở đi, và là tiền thân trực tiếp của áo dài hiện đại.',
      'pNgu.li2': 'Năm tà áo mang ý nghĩa gia đình: bốn tà chính tượng trưng cho cha mẹ hai bên, tà thứ năm nhỏ hơn bên trong tượng trưng cho người mặc.',
      'pNgu.li3': 'Áo thường đi cùng cổ đứng, cài bằng khuy bọc vải chạy chéo từ cổ xuống nách.',
      'pNgu.li4': 'Một lớp trong màu tương phản — như chân váy kem ở đây — được để lộ ra ở gấu và xẻ tà hai bên, đó là lý do vải ngoài thường được giữ mỏng hoặc nhẹ.',
      'pNgu.li5': 'Chiếc áo thu gọn thành áo dài hai tà hiện đại vào thập niên 1930; bản tái hiện này phục dựng lại phom năm tà rộng hơn thuở xưa.',
      'pNgu.li6': 'Trâm cài ngọc trai và chuỗi tua trước ngực gợi lại những món trang sức nhỏ từng cài ở cổ áo trong dịp trang trọng, nay được tái hiện bằng ngọc trai thay vì kim loại.',
      'pNgu.onHandText': 'sản phẩm hoàn thiện tại xưởng may Hội An',
      'pNgu.stockNote': 'Voan lụa mỏng được cắt và hoàn thiện thủ công, nên mỗi sản phẩm mất nhiều thời gian hơn vải lót thông thường.',
      'pNgu.chipS': 'S · còn 1',
      'pNgu.chipXL': 'XL · còn 2',
      'pNgu.fabricText': 'Áo ngoài bằng voan lụa màu lam sương, đủ mỏng để lộ chân váy bên trong, khoác ngoài chân váy gấm lụa màu kem có hoa văn dệt riêng.',
      'pNgu.trimLabel': 'Viền & phụ kiện',
      'pNgu.trimText': 'Cổ đứng được lót canh để giữ phom dưới lớp vải mỏng, cài bằng khuy bọc vải, và điểm thêm chuỗi tua hoa ngọc trai xâu tay trước ngực.',
      'pNgu.sw1': 'Voan lam sương',
      'pNgu.sw2': 'Chân váy màu kem',
      'pNgu.sw3': 'Viền ngọc trai'
    },
    en: {
      /* login */
      'login.title': 'Heritage Circuit — Log In',
      'login.h1': 'Welcome Back',
      'login.quote': '“Heritage is not meant to be stored away, but to be worn.”',
      'login.emailLabel': 'Email or username',
      'login.emailPlaceholder': 'Email',
      'login.passwordLabel': 'Password',
      'login.passwordPlaceholder': 'Password',
      'login.remember': 'Remember me',
      'login.forgot': 'Forgot password?',
      'login.submit': 'Log In',
      'login.welcome': 'Welcome ✓',
      'login.or': 'or',
      'login.newHere': 'New here?',
      'login.createAccount': 'Create an account',
      'login.footer': 'HERITAGE CIRCUIT — VIETNAMESE HERITAGE ATTIRE, RESEWN STITCH BY STITCH',

      /* store */
      'store.title': 'Heritage Circuit — The Collection',
      'store.menuQueue': '🥽 Experience Booth Queue',
      'store.menuTicket': '🎟️ Entry Ticket',
      'store.eyebrow': 'Heritage, Retailored',
      'store.h1': 'The Collection',
      'store.intro': 'Three garments restored and reimagined by long-practised traditional weavers in collaboration with Heritage Circuit.',
      'store.catNhatBinh': 'Nguyễn Court Robe',
      'store.catGiaoLinh': 'Cross-Collar Robe',
      'store.catNguThan': 'Five-Panel Robe',
      'store.sub': 'Tap a card to open its page.',
      'store.footer': 'HERITAGE CIRCUIT — BREATHING SOUL INTO MACHINES, ILLUMINATING HERITAGE',

      /* shared footers */
      'common.footerMachine': 'HERITAGE CIRCUIT — BREATHING SOUL INTO MACHINES, ILLUMINATING HERITAGE',
      'common.footerTailor': 'HERITAGE CIRCUIT — VIETNAMESE HERITAGE ATTIRE, RESEWN STITCH BY STITCH',

      /* rules / terms */
      'rules.title': 'Heritage Circuit — Terms of Service',
      'rules.eyebrow': 'Policies & Regulations',
      'rules.h1': 'Terms of Service',
      'rules.s1title': '1. Ordering & Payment',
      'rules.s1body': 'Every piece is made to order — nothing is held pre-made in stock. A 30% deposit confirms your place in the workshop queue; the balance is due once the piece is finished, before it ships.',
      'rules.s2title': '2. Measurements & Alterations',
      'rules.s2body': 'Made-to-measure pieces are cut from the measurements you provide after ordering. Adjustments requested after cutting has begun may carry an additional fee depending on how far along the piece is.',
      'rules.s3title': '3. Material & Care',
      'rules.s3body': 'Hand wash cold or dry clean only — machine washing damages natural dyes and hand embroidery. Dry flat, out of direct sunlight, and store folded with acid-free tissue rather than on a hanger.',
      'rules.s4title': '4. Returns & Cancellations',
      'rules.s4body': 'Because each piece is made specifically for you, we’re unable to accept returns for sizing or preference once completed. The one exception is a genuine defect in workmanship, covered within 7 days of delivery.',
      'rules.s5title': '5. Copyright & Intellectual Property',
      'rules.s5body': 'Every silhouette is our own reproduction of a traditional Vietnamese garment form. Photographs, descriptions, and embroidery patterns on this site belong to Heritage Circuit and may not be reproduced or resold.',
      'rules.agree': 'I Agree',
      'rules.agreed': 'Agreed ✓',

      /* entry ticket */
      'entry.title': 'Heritage Circuit — Entry Ticket',
      'entry.eyebrow': 'Heritage Circuit',
      'entry.h1': 'Your Entry Ticket',
      'entry.viet': 'Show this ticket at the building entrance',
      'entry.ticketTitle': 'Building Entry',
      'entry.admit': 'Admit One',
      'entry.guestLabel': 'Guest',
      'entry.idLabel': 'Ticket ID',
      'entry.scan': 'Scan at the entrance',
      'entry.continue': 'Continue to Main Page',

      /* queue */
      'queue.title': 'Heritage Circuit — Queue',
      'queue.topTitle': 'VR Experience Queue',
      'queue.vrTitle': 'Step Into the Experience',
      'queue.vrText': 'Step through a doorway in time with a state-of-the-art, multi-sensory virtual reality (VR) experience, where you can freely wander ancient historical sites, immerse yourself in the everyday life of the past, and admire exquisitely recreated period costumes. An advanced sensory simulation system awakens every emotion through passing breezes, lifelike shifts in temperature, and faint scents drifting through the air — for the most vivid and lifelike journey across time.',
      'queue.h1': 'Join the Experience',
      'queue.viet': 'Register, choose a booth, and get your ticket to the immersive VR experience',
      'queue.step1': 'Register',
      'queue.registerText': 'Register to join the booth queue.',
      'queue.registerBtn': 'Register for Queue',
      'queue.step2': 'Choose a Booth',
      'queue.boothText': 'Tap to select an empty booth.',
      'queue.legendEmpty': 'Empty',
      'queue.legendOccupied': 'Occupied',
      'queue.step3': 'Choose Outfit & Generate Ticket',
      'queue.step3Text': 'Pick which outfit this booth visit is for, then generate your ticket.',
      'queue.continue': 'Continue',
      'queue.boothName': 'VR Booth',
      'queue.boothWord': 'Booth',
      'queue.alreadyReg': 'You’re already registered',
      'queue.registeredPos': 'Registered — position #{n} in line',
      'queue.registeredToast': 'Registered — position #{n}',
      'queue.boothOccupied': 'Booth {n} is occupied — choose an empty one',
      'queue.chooseFirst': 'Choose an empty booth first',

      /* generate ticket */
      'generate.title': 'Heritage Circuit — Generate Ticket',
      'generate.eyebrow': 'Heritage Circuit',
      'generate.h1': 'Generate Ticket',
      'generate.viet': 'Customize your outfit',
      'generate.outfitLabel': 'Outfit',
      'generate.select': 'Select...',
      'generate.previewOutfit': 'Select an outfit to preview it here',
      'generate.noOutfit': 'No outfit selected',
      'generate.sizeLabel': 'Size',
      'generate.colorLabel': 'Color',
      'generate.formLabel': 'Form',
      'generate.formFemale': 'Female',
      'generate.formMale': 'Male',
      'generate.settingLabel': 'VR Setting',
      'generate.previewSetting': 'Select a setting to preview it here',
      'generate.noSetting': 'No setting selected',
      'generate.sumOutfit': 'Outfit:',
      'generate.sumSize': 'Size:',
      'generate.sumColor': 'Colour:',
      'generate.sumForm': 'Form:',
      'generate.sumSetting': 'VR Setting:',
      'generate.unset': 'Unset',
      'generate.qrLabel': 'Your QR Ticket',
      'generate.qrDesc': 'Present this code at the booth',
      'generate.timeframe': 'Time frame',
      'generate.openBooth': 'Open booth page to scan',
      'generate.boothNote': 'Booth {n} — {name}',
      'generate.noBoothNote': 'No booth selected — go back to Queue first',
      'generate.chooseBoothFirst': 'Choose a booth from the Queue page first',
      'generate.selectAll': 'Please select all fields first',
      'generate.ticketGenerated': 'Ticket generated',

      /* product — shared */
      'product.tapHint': 'Tap a field to open it',
      'product.info': 'Info',
      'product.stock': 'Stock',
      'product.material': 'Material',
      'product.back': 'Back',
      'product.tagHeritage': 'Heritage',
      'product.tagAvailability': 'Availability',
      'product.tagMaterial': 'Material',
      'product.onHand': 'On hand',
      'product.bySize': 'By size',
      'product.refChart': 'Reference chart',
      'product.fabric': 'Fabric',
      'product.thSize': 'Size',
      'product.thChest': 'Chest',
      'product.thLength': 'Length',
      'product.thSleeve': 'Sleeve',

      /* product — Nhật Bình */
      'pNhat.title': 'Heritage Circuit — Nhật Bình Phượng Hoàng',
      'pNhat.heroViet': 'Red brocade Nhật Bình robe with embroidered phoenixes',
      'pNhat.heroSub': 'A majestic reproduction of the Nguyễn Dynasty court robe, hand-embroidered with phoenix motifs on premium silk brocade.',
      'pNhat.navInfo': 'Nguyễn court dress · history',
      'pNhat.navStock': '18 pieces · made to order',
      'pNhat.navMaterial': 'Silk brocade · gold thread',
      'pNhat.li1': 'Nhật Bình was the ceremonial court dress of queens, princesses, and high-ranking women of the Nguyễn Dynasty, worn from the 19th into the early 20th century.',
      'pNhat.li2': 'The name comes from its square, front-facing collar — cổ vuông — which sits flat like the character for “sun” (nhật) when viewed head-on.',
      'pNhat.li3': 'Colour marked rank at court: bright yellow was reserved for the queen, red for princesses and senior consorts, with purple and blue worn further down the hierarchy.',
      'pNhat.li4': 'The roundels on the chest and back are embroidered with phượng, the phoenix — the female counterpart to the dragon roundels reserved for the emperor’s robe.',
      'pNhat.li5': 'The rounded headdress seen with it, khăn vành, is wound from a single long strip of fabric, its brim sloping gently at the back like a crescent moon.',
      'pNhat.li6': 'This reproduction keeps the hand-embroidered collar and phoenix roundels, tailored for modern brides and ceremony wear rather than daily palace duty.',
      'pNhat.onHandText': 'pieces finished at the Huế embroidery workshop',
      'pNhat.stockNote': 'Each collar is hand-embroidered to order, so lead time runs 3–5 weeks once a size is confirmed.',
      'pNhat.chipS': 'S · 2 left',
      'pNhat.chipXL': 'XL · 3 left',
      'pNhat.fabricText': 'Silk brocade (gấm) for the robe body, with a densely woven cotton-silk blend behind the collar to hold its shape.',
      'pNhat.embLabel': 'Embroidery',
      'pNhat.embText': 'The collar and roundels are hand-embroidered in gold-wrapped thread and silk floss, following the phượng (phoenix) motif traditional to women’s court dress.',
      'pNhat.sw1': 'Imperial red brocade',
      'pNhat.sw2': 'Indigo collar trim',
      'pNhat.sw3': 'Gold thread',

      /* product — Giao Lĩnh */
      'pGiao.title': 'Heritage Circuit — Giao Lĩnh Lục Trúc',
      'pGiao.heroViet': 'Green silk cross-collar robe in bamboo tones',
      'pGiao.heroSub': 'A cross-collar robe dyed with green tea leaf, cut loose for slow afternoons in the bamboo grove.',
      'pGiao.navInfo': 'Cross-collar robe · history',
      'pGiao.navStock': '24 pieces · dyed in batches',
      'pGiao.navMaterial': 'Silk · tea-leaf dyed',
      'pGiao.li1': 'Giao lĩnh (交領, “crossed collar”) is one of the oldest recorded Vietnamese garment forms, worn from at least the Lý–Trần dynasties onward by both men and women.',
      'pGiao.li2': 'Its defining feature is the collar itself: the two front panels cross over the chest in a V, closing left-over-right, then tied with a sash rather than buttoned.',
      'pGiao.li3': 'Everyday versions used light, unlined sleeves, while ceremonial ones used fuller, weighted sleeves like this one, so the fabric falls in soft folds when the arms are still.',
      'pGiao.li4': 'Because the robe opens at the front, a pale underlayer was traditionally worn beneath it, visible at the collar and hem — the same soft two-tone look kept in this reproduction.',
      'pGiao.li5': 'The cross-collar robe form predates and directly influenced the Japanese kimono and Korean hanbok, all descending from a shared cross-collar tradition across East and Southeast Asia.',
      'pGiao.li6': 'This piece lightens the traditional fabric weight and dyes it in green tea leaf, suited to outdoor portraits and daytime ceremony rather than formal court wear.',
      'pGiao.onHandText': 'pieces from the current tea-leaf dye batch',
      'pGiao.stockNote': 'Colour depth varies slightly batch to batch, since the shade comes straight from the tea leaves used that week.',
      'pGiao.chipS': 'S · 4 left',
      'pGiao.chipXL': 'XL · 2 left',
      'pGiao.fabricText': 'A soft mulberry silk for the outer robe, paired with a lighter ivory silk underlayer that shows through at the collar, cuffs, and hem.',
      'pGiao.dyeLabel': 'Dye & trim',
      'pGiao.dyeText': 'Colour comes from a green tea leaf dye bath, giving the sage tone its slightly warm, muted cast rather than a flat synthetic green.',
      'pGiao.sw1': 'Tea-leaf sage green',
      'pGiao.sw2': 'Ivory underlayer',
      'pGiao.sw3': 'Bamboo-toned sash',

      /* product — Ngũ Thân */
      'pNgu.title': 'Heritage Circuit — Ngũ Thân Vân Lam',
      'pNgu.heroViet': 'Sheer blue ngũ thân robe over a cream skirt',
      'pNgu.heroSub': 'A sheer organza five-panel robe in dusty blue, worn over an ivory underskirt in the old fuller shape.',
      'pNgu.navInfo': 'Five-panel robe · history',
      'pNgu.navStock': '15 pieces · made to order',
      'pNgu.navMaterial': 'Silk organza · pearl trim',
      'pNgu.li1': 'Áo ngũ thân, “the five-paneled robe,” was the standard formal outer garment for both men and women in Vietnam from the 18th century onward, and the direct ancestor of the modern áo dài.',
      'pNgu.li2': 'The five panels carried a family meaning: four main panels stood for the wearer’s parents, and a fifth, smaller inner panel stood for the wearer.',
      'pNgu.li3': 'It was traditionally worn with a standing mandarin collar, cổ đứng, closed by cloth-covered buttons running diagonally from the neck to the underarm.',
      'pNgu.li4': 'An inner layer in a contrasting colour — like the cream underskirt shown here — was meant to show through at the hem and side slits, which is why the outer fabric was historically kept sheer or lightweight.',
      'pNgu.li5': 'The garment narrowed into the modern two-panel áo dài in the 1930s; this reproduction restores the older, fuller five-panel silhouette.',
      'pNgu.li6': 'The pearl hairpins and chest tassel echo the small ornaments once pinned at the collar for formal occasions, reimagined here in pearl rather than metal.',
      'pNgu.onHandText': 'pieces finished at the Hội An sewing workshop',
      'pNgu.stockNote': 'The sheer organza is cut and finished by hand, so each piece takes longer than a standard lining fabric would.',
      'pNgu.chipS': 'S · 1 left',
      'pNgu.chipXL': 'XL · 2 left',
      'pNgu.fabricText': 'A dusty-blue silk organza outer robe, sheer enough to let the underskirt show through, over a cream silk-brocade underskirt with its own woven pattern.',
      'pNgu.trimLabel': 'Trim',
      'pNgu.trimText': 'The standing collar is interfaced to hold its shape under sheer fabric, closed with cloth-covered buttons, and finished with a hand-strung pearl floral tassel at the chest.',
      'pNgu.sw1': 'Dusty blue organza',
      'pNgu.sw2': 'Cream underskirt',
      'pNgu.sw3': 'Pearl trim'
    }
  };

  function getLang() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    } catch (e) { /* storage unavailable */ }
    return DEFAULT_LANG;
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
    apply(lang);
  }

  /** Look up a single string in the active (or given) language. */
  function t(key, lang) {
    const strings = DICT[lang || getLang()] || DICT[DEFAULT_LANG];
    return (strings && strings[key] !== undefined) ? strings[key] : key;
  }

  /** Apply the language to the whole document. */
  function apply(lang) {
    const strings = DICT[lang] || DICT[DEFAULT_LANG];
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (strings[key] !== undefined) el.textContent = strings[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-placeholder');
      if (strings[key] !== undefined) el.setAttribute('placeholder', strings[key]);
    });

    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-title');
      if (strings[key] !== undefined) document.title = strings[key];
    });

    // reflect the active language on the toggle
    document.querySelectorAll('.lang-opt').forEach(function (btn) {
      const on = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function init() {
    document.querySelectorAll('.lang-opt').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLang(btn.getAttribute('data-lang'));
      });
    });
    apply(getLang());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { getLang: getLang, setLang: setLang, apply: apply, t: t };
})();

/* Also expose on window so it's reachable via window.HeritageI18n
   (a top-level const is not automatically a window property). */
if (typeof window !== 'undefined') { window.HeritageI18n = HeritageI18n; }
