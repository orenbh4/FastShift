const apiBase = "";
const departments = ["SOC", "NOC"];
const systemAdminRole = "מנהל מערכת";
const managerRoles = [systemAdminRole, "מנהל SOC", "מנהל NOC", "מנהל/ת"];
const employeeRoles = ["Tier 1", "Tier 2", "NOC - משרה מלאה", "NOC - משרה חלקית", "עובד/ת"];
const fallbackUser = { name: "מנהל מערכת", email: "manager@fastshift.local", role: systemAdminRole, department: "NOC" };
const rolesByDepartment = {
  SOC: ["Tier 1", "Tier 2", "אחראי/ת משמרת", "מנהל SOC"],
  NOC: ["NOC - משרה מלאה", "NOC - משרה חלקית", "אחראי/ת משמרת", "מנהל NOC"],
};
const shifts = [
  { label: "בוקר", time: "07:00-15:00", className: "morning" },
  { label: "ערב", time: "15:00-23:00", className: "evening" },
  { label: "לילה", time: "23:00-07:00", className: "night" },
];
const socMiddleShift = { label: "אמצע", time: "10:00-18:00", className: "middle", tier: "Tier 2", dividerBefore: true };
const dayNames = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
const localeByLanguage = {
  he: "he-IL",
  en: "en-US",
  ar: "ar",
};
const viewNames = {
  home: "מסך בית",
  weekly: "סידור שבועי",
  scheduling: "שיבוץ עובדים",
  availability: "זמינות למשמרות",
  attendance: "כניסה/יציאה ממשמרת",
  employees: "כל העובדים",
  users: "משתמשים והרשאות",
  reports: "דוחות",
  settings: "הגדרות",
  logout: "התנתקות",
};
const translations = {
  he: {
    home: "מסך בית",
    weekly: "סידור שבועי",
    scheduling: "שיבוץ עובדים",
    availability: "זמינות למשמרות",
    attendance: "כניסה/יציאה ממשמרת",
    employees: "כל העובדים",
    users: "משתמשים והרשאות",
    reports: "דוחות",
    settings: "הגדרות",
    appSubtitle: "מערכת משמרות ארגונית",
    currentVersion: "גרסה נוכחית",
    notifications: "התראות",
    language: "שפה",
    display: "תצוגה",
    light: "בהיר",
    dark: "כהה",
    system: "מערכת",
  },
  en: {
    home: "Home",
    weekly: "Weekly Schedule",
    scheduling: "Employee Scheduling",
    availability: "Shift Availability",
    attendance: "Clock In/Out",
    employees: "Employees",
    users: "Users & Permissions",
    reports: "Reports",
    settings: "Settings",
    appSubtitle: "Organizational shift system",
    currentVersion: "Current Version",
    notifications: "Notifications",
    language: "Language",
    display: "Display",
    light: "Light",
    dark: "Dark",
    system: "System",
  },
  ar: {
    home: "الرئيسية",
    weekly: "الجدول الأسبوعي",
    scheduling: "توزيع الموظفين",
    availability: "توفر الورديات",
    attendance: "الدخول/الخروج من الوردية",
    employees: "كل الموظفين",
    users: "المستخدمون والصلاحيات",
    reports: "التقارير",
    settings: "الإعدادات",
    appSubtitle: "نظام ورديات مؤسسي",
    currentVersion: "الإصدار الحالي",
    notifications: "التنبيهات",
    language: "اللغة",
    display: "العرض",
    light: "فاتح",
    dark: "داكن",
    system: "النظام",
  },
};
const uiDictionary = {
  "מסך בית": { en: "Home", ar: "الرئيسية" },
  "סידור שבועי": { en: "Weekly Schedule", ar: "الجدول الأسبوعي" },
  "שיבוץ עובדים": { en: "Employee Scheduling", ar: "توزيع الموظفين" },
  "זמינות למשמרות": { en: "Shift Availability", ar: "توفر الورديات" },
  "כניסה/יציאה ממשמרת": { en: "Clock In/Out", ar: "الدخول/الخروج من الوردية" },
  "כל העובדים": { en: "Employees", ar: "كل الموظفين" },
  "משתמשים והרשאות": { en: "Users & Permissions", ar: "المستخدمون والصلاحيات" },
  "דוחות": { en: "Reports", ar: "التقارير" },
  "הגדרות": { en: "Settings", ar: "الإعدادات" },
  "היום": { en: "Today", ar: "اليوم" },
  "סטטוס נוכחות": { en: "Attendance Status", ar: "حالة الحضور" },
  "המשמרת הקרובה": { en: "Next Shift", ar: "الوردية القادمة" },
  "צפייה בסידור": { en: "View Schedule", ar: "عرض الجدول" },
  "היום בסידור": { en: "Today in Schedule", ar: "اليوم في الجدول" },
  "בודק סידור": { en: "Checking schedule", ar: "جار فحص الجدول" },
  "התראות פעילות": { en: "Active Alerts", ar: "تنبيهات نشطة" },
  "חג/מועד השבוע": { en: "Holiday/Event This Week", ar: "عيد/موعد هذا الأسبوع" },
  "תזכורת למשמרת קרובה": { en: "Upcoming Shift Reminder", ar: "تذكير وردية قريبة" },
  "חוסר בכוח אדם": { en: "Staffing Shortage", ar: "نقص في القوى العاملة" },
  "פתיחה": { en: "Open", ar: "فتح" },
  "סגירה": { en: "Close", ar: "إغلاق" },
  "פעולות מהירות": { en: "Quick Actions", ar: "إجراءات سريعة" },
  "התחברות": { en: "Login", ar: "تسجيل الدخول" },
  "הרשמה": { en: "Register", ar: "التسجيل" },
  "אימייל": { en: "Email", ar: "البريد الإلكتروني" },
  "סיסמה": { en: "Password", ar: "كلمة المرور" },
  "שכחתי סיסמה": { en: "Forgot password", ar: "نسيت كلمة المرور" },
  "איפוס סיסמה": { en: "Reset Password", ar: "إعادة تعيين كلمة المرور" },
  "שליחת קישור איפוס": { en: "Send Reset Link", ar: "إرسال رابط إعادة التعيين" },
  "חזרה להתחברות": { en: "Back to Login", ar: "العودة لتسجيل الدخول" },
  "כניסה למערכת": { en: "Sign In", ar: "الدخول إلى النظام" },
  "יצירת משתמש": { en: "Create User", ar: "إنشاء مستخدم" },
  "שם מלא": { en: "Full Name", ar: "الاسم الكامل" },
  "שם העובד/ת": { en: "Employee name", ar: "اسم الموظف/ة" },
  "תפקיד": { en: "Role", ar: "الدور" },
  "עובד/ת": { en: "Employee", ar: "موظف/ة" },
  "Tier 1": { en: "Tier 1", ar: "Tier 1" },
  "Tier 2": { en: "Tier 2", ar: "Tier 2" },
  "NOC - משרה מלאה": { en: "NOC - Full Time", ar: "NOC - دوام كامل" },
  "NOC - משרה חלקית": { en: "NOC - Part Time", ar: "NOC - دوام جزئي" },
  "אחראי/ת משמרת": { en: "Shift Lead", ar: "مسؤول/ة وردية" },
  "מנהל/ת": { en: "Admin", ar: "مدير/ة" },
  "מנהל": { en: "Manager", ar: "مدير" },
  "מנהל SOC": { en: "SOC Manager", ar: "مدير SOC" },
  "מנהל NOC": { en: "NOC Manager", ar: "مدير NOC" },
  "אחראי משמרת SOC": { en: "SOC Shift Lead", ar: "مسؤول وردية SOC" },
  "אחראי משמרת NOC": { en: "NOC Shift Lead", ar: "مسؤول وردية NOC" },
  "מנהל מערכת": { en: "System Admin", ar: "مدير النظام" },
  "שעון משמרת": { en: "Shift Clock", ar: "ساعة الوردية" },
  "לא נמצאת משמרת פעילה": { en: "No active shift", ar: "لا توجد وردية نشطة" },
  "כניסה למשמרת": { en: "Clock In", ar: "بدء الوردية" },
  "יציאה ממשמרת": { en: "Clock Out", ar: "إنهاء الوردية" },
  "הזנת שעות ידנית": { en: "Manual Hours Entry", ar: "إدخال ساعات يدوي" },
  "סוג משמרת": { en: "Shift Type", ar: "نوع الوردية" },
  "שמירת שעות": { en: "Save Hours", ar: "حفظ الساعات" },
  "כל כניסה ויציאה מתועדות ונשמרות במסד הנתונים.": {
    en: "Every clock in/out is recorded in the database.",
    ar: "يتم تسجيل كل دخول وخروج في قاعدة البيانات.",
  },
  "תיעוד נוכחות": { en: "Attendance Log", ar: "سجل الحضور" },
  "ניקוי תיעוד": { en: "Clear Log", ar: "مسح السجل" },
  "שמירת מחיקות": { en: "Save Deletions", ar: "حفظ الحذف" },
  "מצב מחיקה פעיל. סמן רשומות למחיקה ואז לחץ שמירת מחיקות.": {
    en: "Delete mode is active. Mark records for deletion, then click Save Deletions.",
    ar: "وضع الحذف نشط. حدّد السجلات للحذف ثم اضغط حفظ الحذف.",
  },
  "לא נבחרו רשומות למחיקה.": { en: "No records were selected for deletion.", ar: "لم يتم تحديد سجلات للحذف." },
  "רשומות הנוכחות שנבחרו נמחקו.": { en: "The selected attendance records were deleted.", ar: "تم حذف سجلات الحضور المحددة." },
  "מחיקת הנוכחות בוטלה.": { en: "Attendance deletion was canceled.", ar: "تم إلغاء حذف الحضور." },
  "אין עדיין תיעוד כניסה או יציאה ממשמרת.": {
    en: "There are no clock-in or clock-out records yet.",
    ar: "لا توجد سجلات دخول أو خروج من الوردية بعد.",
  },
  "עובד/ת": { en: "Employee", ar: "موظف/ة" },
  "כניסה": { en: "Clock In", ar: "الدخول" },
  "יציאה": { en: "Clock Out", ar: "الخروج" },
  "משך": { en: "Duration", ar: "المدة" },
  "סטטוס": { en: "Status", ar: "الحالة" },
  "הושלם": { en: "Completed", ar: "مكتمل" },
  "פעיל": { en: "Active", ar: "نشط" },
  "פעיל/ה": { en: "Active", ar: "نشط/ة" },
  "ממתין לאימות": { en: "Pending Verification", ar: "بانتظار التحقق" },
  "מאושר": { en: "Approved", ar: "معتمد" },
  "חסר": { en: "Missing", ar: "ناقص" },
  "דיווח זמינות": { en: "Report Availability", ar: "تسجيل التوفر" },
  "תאריך": { en: "Date", ar: "التاريخ" },
  "משמרת": { en: "Shift", ar: "الوردية" },
  "זמין/ה": { en: "Available", ar: "متاح/ة" },
  "לא זמין": { en: "Unavailable", ar: "غير متاح" },
  "לא זמין/ה": { en: "Unavailable", ar: "غير متاح/ة" },
  "עדיפות נמוכה": { en: "Low Priority", ar: "أولوية منخفضة" },
  "לא דווח": { en: "Not Reported", ar: "لم يتم الإبلاغ" },
  "שמירת זמינות": { en: "Save Availability", ar: "حفظ التوفر" },
  "עדכון זמינות": { en: "Update Availability", ar: "تحديث التوفر" },
  "שיבוץ לפי תאריכים": { en: "Assignments by Date", ar: "التوزيع حسب التواريخ" },
  "אין דיווחי זמינות עדיין.": { en: "No availability reports yet.", ar: "لا توجد تقارير توفر بعد." },
  "שיבוץ ידני למשמרת": { en: "Manual Shift Assignment", ar: "توزيع يدوي للوردية" },
  "שיבוץ עובד/ת": { en: "Assign Employee", ar: "توزيع موظف/ة" },
  "זמינות מדווחת לתאריך הנבחר": { en: "Reported Availability for Selected Date", ar: "التوفر المسجل للتاريخ المحدد" },
  "בחר/י משמרת בטבלה": { en: "Select a shift in the table", ar: "اختر وردية في الجدول" },
  "לאחר בחירת משמרת תוצג כאן רשימת עובדים לפי זמינות.": {
    en: "After selecting a shift, employees will appear here by availability.",
    ar: "بعد اختيار وردية، ستظهر هنا قائمة الموظفين حسب التوفر.",
  },
  "הרשימה ממוינת לפי זמינות העובדים למשמרת שנבחרה.": {
    en: "The list is sorted by employee availability for the selected shift.",
    ar: "القائمة مرتبة حسب توفر الموظفين للوردية المختارة.",
  },
  "אין עובדים פעילים לשיבוץ.": { en: "No active employees to assign.", ar: "لا يوجد موظفون نشطون للتوزيع." },
  "כבר הוזן ידנית": { en: "Already entered manually", ar: "تم إدخاله يدويا" },
  "הערה למשמרת": { en: "Shift note", ar: "ملاحظة للوردية" },
  "סיכום שבועי": { en: "Weekly Summary", ar: "ملخص أسبوعي" },
  "נתוני השבוע הקרוב": { en: "Upcoming Week Data", ar: "بيانات الأسبوع القادم" },
  "סיכום שיבוצים לפי עובד": { en: "Assignments by employee", ar: "التوزيعات حسب الموظف" },
  "סה״כ": { en: "Total", ar: "المجموع" },
  "שמור כטיוטה": { en: "Save Draft", ar: "حفظ كمسودة" },
  "פרסום סידור": { en: "Publish Schedule", ar: "نشر الجدول" },
  "בוקר": { en: "Morning", ar: "صباح" },
  "ערב": { en: "Evening", ar: "مساء" },
  "לילה": { en: "Night", ar: "ليل" },
  "אמצע": { en: "Middle", ar: "وسط" },
  "משמרת אמצע": { en: "Middle Shift", ar: "وردية الوسط" },
  "לא שובץ עובד": { en: "No employee assigned", ar: "لم يتم توزيع موظف" },
  "לא פורסם עדיין סידור": { en: "Schedule has not been published yet", ar: "لم يتم نشر الجدول بعد" },
  "לא פורסם עדיין סידור לשבוע הזה": { en: "No schedule has been published for this week yet", ar: "لم يتم نشر جدول لهذا الأسبوع بعد" },
  "לאחר פרסום הסידור בעמוד שיבוץ עובדים, הוא יופיע כאן.": {
    en: "After publishing the schedule in Employee Scheduling, it will appear here.",
    ar: "بعد نشر الجدول في صفحة توزيع الموظفين، سيظهر هنا.",
  },
  "אין שיבוצים לשבוע הזה": { en: "No assignments for this week", ar: "لا توجد توزيعات لهذا الأسبوع" },
  "אין שיבוצים להצגה בשבוע הנבחר.": { en: "No assignments to show for the selected week.", ar: "لا توجد توزيعات لعرضها في الأسبوع المحدد." },
  "טיוטה": { en: "Draft", ar: "مسودة" },
  "חיפוש עובד/ת": { en: "Search employee", ar: "بحث عن موظف/ة" },
  "ייצוא רשימה": { en: "Export List", ar: "تصدير القائمة" },
  "רשימת עובדים": { en: "Employee List", ar: "قائمة الموظفين" },
  "סה\"כ עובדים פעילים": { en: "Total Active Employees", ar: "إجمالي الموظفين النشطين" },
  "לא נמצאו עובדים פעילים לייצוא.": { en: "No active employees found for export.", ar: "لم يتم العثور على موظفين نشطين للتصدير." },
  "שם": { en: "Name", ar: "الاسم" },
  "טלפון": { en: "Phone", ar: "الهاتف" },
  "מספר עובד": { en: "Employee Number", ar: "رقم الموظف" },
  "מייל": { en: "Email", ar: "البريد الإلكتروني" },
  "משרה חלקית": { en: "Part Time", ar: "دوام جزئي" },
  "משרה מלאה": { en: "Full Time", ar: "دوام كامل" },
  "עדכון": { en: "Update", ar: "تحديث" },
  "עריכה": { en: "Edit", ar: "تحرير" },
  "שמירה": { en: "Save", ar: "حفظ" },
  "ביטול": { en: "Cancel", ar: "إلغاء" },
  "עדכון פרטים": { en: "Update Details", ar: "تحديث التفاصيل" },
  "עידכון פרטים": { en: "Update Details", ar: "تحديث التفاصيل" },
  "שעות חודשיות": { en: "Monthly Hours", ar: "الساعات الشهرية" },
  "הוספת משתמש": { en: "Add User", ar: "إضافة مستخدم" },
  "הרשאה": { en: "Permission", ar: "الصلاحية" },
  "מחלקה": { en: "Department", ar: "القسم" },
  "מחלקה לצפייה": { en: "Department View", ar: "عرض القسم" },
  "עובד/ת להצגת דוחות": { en: "Employee for Reports", ar: "موظف/ة لعرض التقارير" },
  "עובד/ת להצגת נוכחות": { en: "Employee for Attendance", ar: "موظف/ة لعرض الحضور" },
  "עובד/ת להצגת זמינות": { en: "Employee for Availability", ar: "موظف/ة لعرض التوفر" },
  "שליחת הזמנה לאימות": { en: "Send Verification Invite", ar: "إرسال دعوة تحقق" },
  "ניהול הרשאות": { en: "Permission Management", ar: "إدارة الصلاحيات" },
  "אימות ידני": { en: "Manual Verify", ar: "تحقق يدوي" },
  "מחיקה": { en: "Delete", ar: "حذف" },
  "מתאריך": { en: "From Date", ar: "من تاريخ" },
  "עד תאריך": { en: "To Date", ar: "إلى تاريخ" },
  "הפקת דוח שעות": { en: "Generate Hours Report", ar: "إنشاء تقرير الساعات" },
  "דוח שעות": { en: "Hours Report", ar: "تقرير الساعات" },
  "חישוב שכר": { en: "Payroll Calculation", ar: "حساب الراتب" },
  "הצגת משמרות": { en: "Show Shifts", ar: "عرض الورديات" },
  "לא נמצאו משמרות בטווח התאריכים שנבחר.": {
    en: "No shifts were found in the selected date range.",
    ar: "لم يتم العثور على ورديات ضمن نطاق التواريخ المحدد.",
  },
  "סה\"כ שעות": { en: "Total Hours", ar: "إجمالي الساعات" },
  "משמרות": { en: "Shifts", ar: "الورديات" },
  "חוסרים": { en: "Missing", ar: "النواقص" },
  "חוסר בכוח אדם": { en: "Staffing Shortage", ar: "نقص في القوى العاملة" },
  "תזכורת למשמרת קרובה": { en: "Upcoming Shift Reminder", ar: "تذكير وردية قريبة" },
  "חג/מועד השבוע": { en: "Holiday/Event This Week", ar: "عيد/موعد هذا الأسبوع" },
  "שעות": { en: "Hours", ar: "الساعات" },
  "התראות": { en: "Notifications", ar: "التنبيهات" },
  "שליחת תזכורת לפני משמרת": { en: "Send reminder before shift", ar: "إرسال تذكير قبل الوردية" },
  "התראה על חוסר בכוח אדם": { en: "Alert on staffing shortage", ar: "تنبيه عند نقص القوى العاملة" },
  "שפה": { en: "Language", ar: "اللغة" },
  "תצוגה": { en: "Display", ar: "العرض" },
  "גרסה נוכחית": { en: "Current Version", ar: "الإصدار الحالي" },
  "גרסה": { en: "Version", ar: "الإصدار" },
  "התנתקות": { en: "Logout", ar: "تسجيل الخروج" },
  "האם אתה בטוח שאתה רוצה להתנתק?": { en: "Are you sure you want to log out?", ar: "هل أنت متأكد أنك تريد تسجيل الخروج؟" },
  "כן": { en: "Yes", ar: "نعم" },
  "לא": { en: "No", ar: "لا" },
  "בהיר": { en: "Light", ar: "فاتح" },
  "כהה": { en: "Dark", ar: "داكن" },
  "מערכת": { en: "System", ar: "النظام" },
  "ראשון": { en: "Sunday", ar: "الأحد" },
  "שני": { en: "Monday", ar: "الإثنين" },
  "שלישי": { en: "Tuesday", ar: "الثلاثاء" },
  "רביעי": { en: "Wednesday", ar: "الأربعاء" },
  "חמישי": { en: "Thursday", ar: "الخميس" },
  "שישי": { en: "Friday", ar: "الجمعة" },
  "שבת": { en: "Saturday", ar: "السبت" },
  "יום": { en: "Day", ar: "اليوم" },
  "ידני": { en: "Manual", ar: "يدوي" },
  "הוזן על ידי": { en: "Entered By", ar: "أُدخل بواسطة" },
  "כל העובדים": { en: "All Employees", ar: "كل الموظفين" },
  "עובדים פעילים": { en: "Active Employees", ar: "الموظفون النشطون" },
  "משובצים היום": { en: "Assigned Today", ar: "مجدولون اليوم" },
  "נוכחות פעילה": { en: "Active Attendance", ar: "حضور نشط" },
  "שעות החודש": { en: "Monthly Hours", ar: "ساعات الشهر" },
  "ממתינים לאימות": { en: "Pending Verification", ar: "بانتظار التحقق" },
  "מייל אימות נשלח": { en: "Verification email sent", ar: "تم إرسال بريد التحقق" },
  "מוגבל": { en: "Limited", ar: "محدود" },
  "אין משתמשים במערכת.": { en: "No users in the system.", ar: "لا يوجد مستخدمون في النظام." },
  "סידור פורסם": { en: "Schedule Published", ar: "تم نشر الجدول" },
  "לא פורסם עדיין": { en: "Not Published Yet", ar: "لم يتم النشر بعد" },
  "אין משמרת קרובה": { en: "No Upcoming Shift", ar: "لا توجد وردية قادمة" },
  "אין משמרות להצגה היום.": { en: "No shifts to show today.", ar: "لا توجد ورديات لعرضها اليوم." },
  "כל מה שצריך לניהול המשמרות, הזמינות והצוות במקום אחד.": {
    en: "Everything needed to manage shifts, availability, and the team in one place.",
    ar: "كل ما تحتاجه لإدارة الورديات والتوفر والفريق في مكان واحد.",
  },
  "המשמרות, הנוכחות והדוחות האישיים שלך מרוכזים כאן.": {
    en: "Your shifts, attendance, and personal reports are centralized here.",
    ar: "وردياتك وحضورك وتقاريرك الشخصية مركزة هنا.",
  },
  "כאשר יפורסם סידור עם משמרת עבורך, היא תופיע כאן.": {
    en: "When a schedule with your shift is published, it will appear here.",
    ar: "عند نشر جدول يحتوي على وردية لك، ستظهر هنا.",
  },
  "אין התראות פעילות כרגע.": { en: "No active alerts right now.", ar: "لا توجد تنبيهات نشطة حاليا." },
  "המערכת תעדכן כאן תזכורות וחוסרים לפי ההגדרות.": {
    en: "Reminders and shortages will appear here according to your settings.",
    ar: "ستظهر هنا التذكيرات والنواقص حسب إعداداتك.",
  },
  "יום ירושלים": { en: "Jerusalem Day", ar: "يوم القدس" },
  "שבועות": { en: "Shavuot", ar: "شفوعوت" },
  "ערב שבועות": { en: "Eve of Shavuot", ar: "عشية شفوعوت" },
  "פסח": { en: "Passover", ar: "عيد الفصح" },
  "ערב פסח": { en: "Eve of Passover", ar: "عشية عيد الفصح" },
  "ראש השנה": { en: "Rosh Hashanah", ar: "رأس السنة العبرية" },
  "יום כיפור": { en: "Yom Kippur", ar: "يوم الغفران" },
  "סוכות": { en: "Sukkot", ar: "سوكوت" },
  "חנוכה": { en: "Hanukkah", ar: "حانوكا" },
  "פורים": { en: "Purim", ar: "بوريم" },
  "אין עובדים פעילים. צור משתמש ואמת אותו כדי שיופיע כאן.": {
    en: "No active employees. Create and verify a user so they appear here.",
    ar: "لا يوجد موظفون نشطون. أنشئ مستخدما وفعّله ليظهر هنا.",
  },
  "אין הרשאה לצפייה ברשימת העובדים.": { en: "You do not have permission to view the employee list.", ar: "ليست لديك صلاحية لعرض قائمة الموظفين." },
  "אין הרשאה לניהול משתמשים והרשאות.": { en: "You do not have permission to manage users and permissions.", ar: "ليست لديك صلاحية لإدارة المستخدمين والصلاحيات." },
};
const roleAccess = {
  "מנהל מערכת": {
    views: ["home", "weekly", "scheduling", "availability", "attendance", "employees", "users", "reports", "settings"],
    actions: ["manageUsers", "schedule", "publishSchedule", "viewEmployees", "exportEmployees", "reports", "clearAttendance"],
  },
  "מנהל SOC": {
    views: ["home", "weekly", "scheduling", "availability", "attendance", "employees", "users", "reports", "settings"],
    actions: ["manageUsers", "schedule", "publishSchedule", "viewEmployees", "exportEmployees", "reports", "clearAttendance"],
  },
  "מנהל NOC": {
    views: ["home", "weekly", "scheduling", "availability", "attendance", "employees", "users", "reports", "settings"],
    actions: ["manageUsers", "schedule", "publishSchedule", "viewEmployees", "exportEmployees", "reports", "clearAttendance"],
  },
  "מנהל/ת": {
    views: ["home", "weekly", "scheduling", "availability", "attendance", "employees", "users", "reports", "settings"],
    actions: ["manageUsers", "schedule", "publishSchedule", "viewEmployees", "exportEmployees", "reports", "clearAttendance"],
  },
  "אחראי/ת משמרת": {
    views: ["home", "weekly", "scheduling", "availability", "attendance", "reports", "settings"],
    actions: ["schedule", "publishSchedule", "reports"],
  },
  "Tier 1": {
    views: ["home", "weekly", "availability", "attendance", "reports", "settings"],
    actions: ["selfAvailability", "attendance", "reports"],
  },
  "Tier 2": {
    views: ["home", "weekly", "availability", "attendance", "reports", "settings"],
    actions: ["selfAvailability", "attendance", "reports"],
  },
  "NOC - משרה מלאה": {
    views: ["home", "weekly", "availability", "attendance", "reports", "settings"],
    actions: ["selfAvailability", "attendance", "reports"],
  },
  "NOC - משרה חלקית": {
    views: ["home", "weekly", "availability", "attendance", "reports", "settings"],
    actions: ["selfAvailability", "attendance", "reports"],
  },
  "עובד/ת": {
    views: ["home", "weekly", "availability", "attendance", "reports", "settings"],
    actions: ["selfAvailability", "attendance", "reports"],
  },
};
const sessionKeys = {
  email: "fastshift-session-email",
  authToken: "fastshift-auth-token",
  activeBrowserSession: "fastshift-active-browser-session",
  view: "fastshift-session-view",
  weekStart: "fastshift-selected-week-start",
  assignmentDate: "fastshift-assignment-date",
  draftAssignments: "fastshift-draft-assignments",
  draftRemovals: "fastshift-draft-removals",
  notificationSettings: "fastshift-notification-settings",
  sentNotifications: "fastshift-sent-notifications",
  readNotifications: "fastshift-read-notifications",
};
const defaultNotificationSettings = {
  shiftReminders: true,
  staffingShortage: true,
};

let users = [];
let attendanceLog = [];
let attendanceDeleteMode = false;
let attendanceDeleteSelection = new Set();
let availabilityEntries = [];
let jewishHolidays = [];
let jewishHolidayCache = new Map();
let selectedWeekStart = startOfWeek(parseDateOnly(localStorage.getItem(sessionKeys.weekStart) || new Date()));
let selectedAssignmentDate = parseDateOnly(localStorage.getItem(sessionKeys.assignmentDate) || new Date());
let currentSchedule = { published: false, assignments: [] };
let selectedScheduleDepartment = localStorage.getItem("fastshift-schedule-department") || fallbackUser.department;
let notificationAssignments = [];
let notificationSchedules = [];
let draftAssignments = loadDraftAssignments();
let draftRemovals = loadDraftRemovals();
let currentUser = { ...fallbackUser };
let authToken = sessionStorage.getItem(sessionKeys.authToken) || "";
let isAuthenticated = false;
let selectedAssignmentSlot = null;
let employeeEditMode = false;
let weeklyEditMode = false;
let weeklyEditRemovals = new Set();
let weeklyEditAttendanceRemovals = new Set();
let weeklyManualEdits = new Map();
let reportRenderId = 0;

const authShell = document.querySelector("#authShell");
const appShell = document.querySelector("#appShell");
const loginForm = document.querySelector("#loginForm");
const registerForm = document.querySelector("#registerForm");
const forgotPasswordForm = document.querySelector("#forgotPasswordForm");
const loginTab = document.querySelector("#loginTab");
const registerTab = document.querySelector("#registerTab");
const sidebar = document.querySelector(".sidebar");
const viewTitle = document.querySelector("#viewTitle");
const clockToggle = document.querySelector("#clockToggle");
const attendanceState = document.querySelector("#attendanceState");
const liveClock = document.querySelector("#liveClock");
const userCreateForm = document.querySelector("#userCreateForm");
const loginNotice = document.querySelector("#loginNotice");
const registerNotice = document.querySelector("#registerNotice");
const forgotNotice = document.querySelector("#forgotNotice");
const verificationNotice = document.querySelector("#verificationNotice");
const reportFrom = document.querySelector("#reportFrom");
const reportTo = document.querySelector("#reportTo");
const reportUser = document.querySelector("#reportUser");
const attendanceUser = document.querySelector("#attendanceUser");
const scheduleDepartmentSelect = document.querySelector("#scheduleDepartmentSelect");
const employeeDepartmentField = document.querySelector("#employeeDepartmentField");
const employeeDepartmentSelect = document.querySelector("#employeeDepartmentSelect");
const editWeeklySchedule = document.querySelector("#editWeeklySchedule");
const saveWeeklyScheduleEdits = document.querySelector("#saveWeeklyScheduleEdits");
const cancelWeeklyScheduleEdits = document.querySelector("#cancelWeeklyScheduleEdits");
const newUserDepartment = document.querySelector("#newUserDepartment");
const newUserRole = document.querySelector("#newUserRole");
const registerDepartment = document.querySelector("#registerDepartment");
const registerRole = document.querySelector("#registerRole");
const manualAttendanceForm = document.querySelector("#manualAttendanceForm");
const manualAttendanceUser = document.querySelector("#manualAttendanceUser");
const manualAttendanceDate = document.querySelector("#manualAttendanceDate");
const manualAttendanceShift = document.querySelector("#manualAttendanceShift");
const manualAttendanceClockIn = document.querySelector("#manualAttendanceClockIn");
const manualAttendanceClockOut = document.querySelector("#manualAttendanceClockOut");
const manualAttendanceNotice = document.querySelector("#manualAttendanceNotice");
const scheduleNotice = document.querySelector("#scheduleNotice");
const weeklyScheduleNotice = document.querySelector("#weeklyScheduleNotice");
const availabilityNotice = document.querySelector("#availabilityNotice");
const reportNotice = document.querySelector("#reportNotice");
const settingsNotice = document.querySelector("#settingsNotice");
const notificationButton = document.querySelector("#notificationButton");
const notificationBadge = document.querySelector("#notificationBadge");
const notificationPopover = document.querySelector("#notificationPopover");
const notificationList = document.querySelector("#notificationList");
const shiftReminderSetting = document.querySelector("#shiftReminderSetting");
const staffingShortageSetting = document.querySelector("#staffingShortageSetting");
const staffingShortageRow = document.querySelector("#staffingShortageRow");
let currentLanguage = localStorage.getItem("fastshift-language") || "he";

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  const response = await fetch(`${apiBase}${path}`, {
    headers,
    ...options,
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || `Request failed with ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

function loadDraftAssignments() {
  try {
    return JSON.parse(localStorage.getItem(sessionKeys.draftAssignments) || "{}");
  } catch {
    return {};
  }
}

function saveDraftAssignments() {
  localStorage.setItem(sessionKeys.draftAssignments, JSON.stringify(draftAssignments));
}

function loadDraftRemovals() {
  try {
    return JSON.parse(localStorage.getItem(sessionKeys.draftRemovals) || "{}");
  } catch {
    return {};
  }
}

function saveDraftRemovals() {
  localStorage.setItem(sessionKeys.draftRemovals, JSON.stringify(draftRemovals));
}

function loadNotificationSettings() {
  try {
    return { ...defaultNotificationSettings, ...JSON.parse(localStorage.getItem(sessionKeys.notificationSettings) || "{}") };
  } catch {
    return { ...defaultNotificationSettings };
  }
}

function saveNotificationSettings(settings) {
  localStorage.setItem(sessionKeys.notificationSettings, JSON.stringify({ ...defaultNotificationSettings, ...settings }));
}

function loadSentNotifications() {
  try {
    return JSON.parse(localStorage.getItem(getNotificationStorageKey(sessionKeys.sentNotifications)) || "[]");
  } catch {
    return [];
  }
}

function saveSentNotifications(keys) {
  localStorage.setItem(getNotificationStorageKey(sessionKeys.sentNotifications), JSON.stringify([...new Set(keys)].slice(-200)));
}

function loadReadNotifications() {
  try {
    return JSON.parse(localStorage.getItem(getNotificationStorageKey(sessionKeys.readNotifications)) || "[]");
  } catch {
    return [];
  }
}

function saveReadNotifications(keys) {
  localStorage.setItem(getNotificationStorageKey(sessionKeys.readNotifications), JSON.stringify([...new Set(keys)].slice(-300)));
}

function getNotificationDepartment() {
  return isSystemAdmin() ? selectedScheduleDepartment : currentUser.department || "NOC";
}

function getNotificationStorageKey(baseKey) {
  const email = String(currentUser.email || "guest").toLowerCase();
  return `${baseKey}:${email}:${getNotificationDepartment()}`;
}

function getWeekKey() {
  return `${selectedScheduleDepartment}-${toDateInput(selectedWeekStart)}`;
}

function getCurrentDraftAssignments() {
  return draftAssignments[getWeekKey()] || [];
}

function setCurrentDraftAssignments(assignments) {
  draftAssignments[getWeekKey()] = assignments;
  saveDraftAssignments();
}

function getCurrentDraftRemovals() {
  return draftRemovals[getWeekKey()] || [];
}

function setCurrentDraftRemovals(removals) {
  draftRemovals[getWeekKey()] = removals;
  saveDraftRemovals();
}

function isSameAssignmentSlot(assignment, dateKey, shiftLabel, userId) {
  return toDateInput(assignment.shiftDate) === dateKey && assignment.shiftLabel === shiftLabel && assignment.userId === userId;
}

function isRemovedAssignment(assignment) {
  return !assignment.isDraft && getCurrentDraftRemovals().includes(assignment.id);
}

function getAvailabilityEntry(userId, dateKey, shiftLabel) {
  return availabilityEntries.find(
    (entry) => entry.userId === userId && toDateInput(entry.date) === dateKey && entry.shiftLabel === shiftLabel,
  );
}

function getShiftWindow(dateKey, shiftTime) {
  const [startTime, endTime] = shiftTime.split("-");
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const start = parseDateOnly(dateKey);
  start.setHours(startHour, startMinute, 0, 0);
  const end = parseDateOnly(dateKey);
  end.setHours(endHour, endMinute, 0, 0);
  if (end <= start) end.setDate(end.getDate() + 1);
  return { start, end };
}

function getShiftSlotIndex(dateKey, shiftLabel) {
  const departmentShifts = getDepartmentShiftOrder();
  const shiftIndex = departmentShifts.findIndex((shift) => shift.label === shiftLabel);
  const date = parseDateOnly(dateKey);
  const dayIndex = Math.floor(date.getTime() / 86400000);
  return dayIndex * departmentShifts.length + Math.max(0, shiftIndex);
}

function getShortRestConflict({ userId, shiftDate, shiftLabel, shiftTime }) {
  const nextWindow = getShiftWindow(shiftDate, shiftTime);
  const nextSlotIndex = getShiftSlotIndex(shiftDate, shiftLabel);
  return getVisibleAssignmentDraft().find((assignment) => {
    if (assignment.userId !== userId) return false;
    if (toDateInput(assignment.shiftDate) === shiftDate && assignment.shiftLabel === shiftLabel) return false;
    const existingWindow = getShiftWindow(toDateInput(assignment.shiftDate), assignment.shiftTime);
    const restBeforeNext = nextWindow.start - existingWindow.end;
    const restAfterNext = existingWindow.start - nextWindow.end;
    const existingSlotIndex = getShiftSlotIndex(toDateInput(assignment.shiftDate), assignment.shiftLabel);
    return Math.abs(nextSlotIndex - existingSlotIndex) === 1 || restBeforeNext === 0 || restAfterNext === 0;
  });
}

function confirmShortRestAssignment(user, conflict, nextAssignment) {
  if (!conflict) return true;
  const message =
    currentLanguage === "he"
      ? [
          `אזהרה: ${userLabel(user)} כבר משובץ/ת למשמרת עוקבת ללא הפסקה בין המשמרות.`,
          "",
          assignmentLine("שיבוץ קיים", conflict),
          assignmentLine("שיבוץ חדש", nextAssignment),
          "",
          "האם אתה בטוח שאתה רוצה לשבץ את העובד/ת בכל זאת?",
        ].join("\n")
      : [
          `Warning: ${userLabel(user)} is already assigned to a consecutive shift without a break between shifts.`,
          "",
          assignmentLine("Existing assignment", conflict),
          assignmentLine("New assignment", nextAssignment),
          "",
          "Are you sure you want to assign this employee anyway?",
        ].join("\n");
  return window.confirm(message);
}

function confirmNightShiftLimit(user, nextAssignment) {
  if (nextAssignment.shiftLabel !== "לילה") return true;
  const nightCount = getVisibleAssignmentDraft().filter(
    (assignment) => assignment.userId === nextAssignment.userId && assignment.shiftLabel === "לילה",
  ).length;
  if (nightCount < 2) return true;

  const message =
    currentLanguage === "he"
      ? [
          `אזהרה: ${userLabel(user)} כבר משובץ/ת ל-${nightCount} משמרות לילה בשבוע הנבחר.`,
          "",
          assignmentLine("שיבוץ חדש", nextAssignment),
          "",
          "האם אתה בטוח שאתה רוצה לשבץ משמרת לילה נוספת?",
        ].join("\n")
      : [
          `Warning: ${userLabel(user)} is already assigned to ${nightCount} night shifts in the selected week.`,
          "",
          assignmentLine("New assignment", nextAssignment),
          "",
          "Are you sure you want to assign another night shift?",
        ].join("\n");
  return window.confirm(message);
}

function confirmAvailabilityNote(user, nextAssignment) {
  const note = getAvailabilityEntry(nextAssignment.userId, nextAssignment.shiftDate, nextAssignment.shiftLabel)?.note;
  if (!note) return true;
  const message =
    currentLanguage === "he"
      ? [
          `שים לב: ${userLabel(user)} השאיר/ה הערה לזמינות במשמרת הזו.`,
          "",
          `הערה: ${note}`,
          "",
          assignmentLine("משמרת", nextAssignment),
          "",
          "האם לשבץ את העובד/ת בכל זאת?",
        ].join("\n")
      : [
          `Notice: ${userLabel(user)} left an availability note for this shift.`,
          "",
          `Note: ${note}`,
          "",
          assignmentLine("Shift", nextAssignment),
          "",
          "Assign this employee anyway?",
        ].join("\n");
  return window.confirm(message);
}

async function getAssignmentsForWeek(weekStart) {
  const weekKey = toDateInput(weekStart);
  const draftKey = `${selectedScheduleDepartment}-${weekKey}`;
  const schedule =
    weekKey === toDateInput(selectedWeekStart)
      ? currentSchedule
      : await request(`/api/schedules/${weekKey}?department=${encodeURIComponent(selectedScheduleDepartment)}`);
  const removedIds = draftRemovals[draftKey] || [];
  const serverAssignments = schedule.published ? (schedule.assignments || []).filter((assignment) => !removedIds.includes(assignment.id)) : [];
  return [...serverAssignments, ...(draftAssignments[draftKey] || [])];
}

function getAssignmentSaturdayKey(assignment) {
  const { start, end } = getShiftWindow(toDateInput(assignment.shiftDate), assignment.shiftTime);
  if (start.getDay() === 6) return toDateInput(start);
  if (end.getDay() === 6) return toDateInput(end);
  return null;
}

async function getConsecutiveSaturdayConflict(nextAssignment) {
  const targetSaturdayKey = getAssignmentSaturdayKey(nextAssignment);
  if (!targetSaturdayKey) return null;

  const targetSaturday = parseDateOnly(targetSaturdayKey);
  const saturdayDates = [-28, -21, -14, -7, 0, 7, 14, 21, 28].map((offset) => addDays(targetSaturday, offset));
  const assignedSaturdayKeys = new Set([targetSaturdayKey]);
  const weekStarts = [...new Set(saturdayDates.map((date) => toDateInput(startOfWeek(date))))];
  const weekAssignments = (await Promise.all(weekStarts.map((weekStart) => getAssignmentsForWeek(weekStart)))).flat();

  weekAssignments
    .filter((assignment) => assignment.userId === nextAssignment.userId)
    .forEach((assignment) => {
      const saturdayKey = getAssignmentSaturdayKey(assignment);
      if (saturdayKey) assignedSaturdayKeys.add(saturdayKey);
    });

  const sortedKeys = [...assignedSaturdayKeys].sort((a, b) => parseDateOnly(a) - parseDateOnly(b));
  let currentStreak = [];
  for (const saturdayKey of sortedKeys) {
    const previousKey = currentStreak.at(-1);
    const isConsecutive = previousKey && (parseDateOnly(saturdayKey) - parseDateOnly(previousKey)) / 86400000 === 7;
    currentStreak = isConsecutive ? [...currentStreak, saturdayKey] : [saturdayKey];
    if (currentStreak.length >= 2 && currentStreak.includes(targetSaturdayKey)) return currentStreak;
  }

  return null;
}

async function confirmConsecutiveSaturdayLimit(user, nextAssignment) {
  const streak = await getConsecutiveSaturdayConflict(nextAssignment);
  if (!streak) return true;
  const message =
    currentLanguage === "he"
      ? [
          `אזהרה: ${userLabel(user)} משובץ/ת ל-2 שבתות או יותר ברצף.`,
          "",
          `רצף שבתות: ${streak.map((date) => formatDate(date)).join(", ")}`,
          assignmentLine("שיבוץ חדש", nextAssignment),
          "",
          "האם אתה בטוח שאתה רוצה לשבץ שבת נוספת בכל זאת?",
        ].join("\n")
      : [
          `Warning: ${userLabel(user)} is assigned to 2 or more consecutive Saturdays.`,
          "",
          `Saturday streak: ${streak.map((date) => formatDate(date)).join(", ")}`,
          assignmentLine("New assignment", nextAssignment),
          "",
          "Are you sure you want to assign another Saturday anyway?",
        ].join("\n");
  return window.confirm(message);
}

function findAttendanceForAssignment(assignment) {
  const assignmentEmail = String(assignment.email || "").trim().toLowerCase();
  const assignmentEmployee = String(assignment.employee || "").trim();
  const assignmentDepartment = assignment.department || selectedScheduleDepartment || currentUser.department || "NOC";
  const assignmentDate = toDateInput(assignment.shiftDate);
  const { start, end } = getShiftWindow(toDateInput(assignment.shiftDate), assignment.shiftTime);
  const employeeAttendance = attendanceLog.filter((entry) => {
    const entryEmail = String(entry.email || "").trim().toLowerCase();
    const entryEmployee = String(entry.employee || "").trim();
    const entryDepartment = entry.department || assignmentDepartment;
    const sameEmployee = (assignmentEmail && entryEmail === assignmentEmail) || (!assignmentEmail && assignmentEmployee && entryEmployee === assignmentEmployee);
    return sameEmployee && entryDepartment === assignmentDepartment;
  });
  const shiftAttendance = employeeAttendance.filter((entry) => entry.shiftLabel === assignment.shiftLabel);
  const fallbackOpenAttendance = employeeAttendance.filter(
    (entry) =>
      !entry.shiftLabel &&
      !entry.clockOut,
  );
  const relevantAttendance = shiftAttendance.length ? shiftAttendance : fallbackOpenAttendance;
  if (!relevantAttendance.length) return null;
  const overlapping = relevantAttendance
    .filter((entry) => {
      const clockIn = new Date(entry.clockIn);
      const clockOut = entry.clockOut ? new Date(entry.clockOut) : new Date();
      return clockIn < end && clockOut > start;
    })
    .sort((a, b) => new Date(a.clockIn) - new Date(b.clockIn))[0];

  return (
    overlapping ||
    (shiftAttendance.length
      ? shiftAttendance
          .filter((entry) => toDateInput(entry.clockIn) === assignmentDate || (entry.clockOut && toDateInput(entry.clockOut) === assignmentDate))
          .sort((a, b) => new Date(a.clockIn) - new Date(b.clockIn))[0]
      : null)
  );
}

function getAssignmentStart(assignment) {
  return getShiftWindow(toDateInput(assignment.shiftDate), assignment.shiftTime).start;
}

function isCurrentUserAssignment(assignment) {
  return String(assignment.email || "").toLowerCase() === String(currentUser.email || "").toLowerCase();
}

function getUpcomingShiftReminders() {
  const settings = loadNotificationSettings();
  if (!settings.shiftReminders) return [];
  const department = getNotificationDepartment();
  const now = new Date();
  const horizon = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return notificationAssignments
    .filter((assignment) => (assignment.department || "NOC") === department)
    .filter((assignment) => isCurrentUserAssignment(assignment))
    .map((assignment) => ({ assignment, startsAt: getAssignmentStart(assignment) }))
    .filter(({ startsAt }) => startsAt > now && startsAt <= horizon)
    .sort((a, b) => a.startsAt - b.startsAt);
}

function getDashboardAssignments() {
  const assignments = notificationAssignments.length ? notificationAssignments : currentSchedule.assignments || [];
  const seen = new Set();
  return assignments.filter((assignment) => {
    const key = assignment.id || `${assignment.shiftDate}-${assignment.shiftLabel}-${assignment.userId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getNextUserAssignment() {
  const now = new Date();
  return getDashboardAssignments()
    .filter((assignment) => isCurrentUserAssignment(assignment))
    .map((assignment) => ({ assignment, startsAt: getAssignmentStart(assignment) }))
    .filter(({ startsAt }) => startsAt >= now)
    .sort((a, b) => a.startsAt - b.startsAt)[0];
}

function getTodayAssignmentsForDashboard() {
  const todayKey = toDateInput(new Date());
  const canSeeTeam = canManageDepartmentSchedule();
  return getDashboardAssignments()
    .filter((assignment) => toDateInput(assignment.shiftDate) === todayKey)
    .filter((assignment) => canSeeTeam || isCurrentUserAssignment(assignment))
    .sort((a, b) => {
      const departmentShifts = getDepartmentShifts(a.department || b.department || getManagedDepartment());
      return departmentShifts.findIndex((shift) => shift.label === a.shiftLabel) - departmentShifts.findIndex((shift) => shift.label === b.shiftLabel);
    });
}

function getStaffingShortages() {
  const settings = loadNotificationSettings();
  if (!settings.staffingShortage || !can("schedule")) return [];
  const department = getNotificationDepartment();
  const schedule =
    (currentSchedule.department || selectedScheduleDepartment || "NOC") === department
      ? currentSchedule
      : notificationSchedules.find((item) => item.department === department && item.weekStart === toDateInput(selectedWeekStart));
  if (!schedule?.published) return [];
  const assignments = schedule.assignments || [];
  return Array.from({ length: 7 }, (_, dayIndex) => {
    const date = addDays(selectedWeekStart, dayIndex);
    const dateKey = toDateInput(date);
    return getDepartmentShifts(department)
      .filter((shift) => !assignments.some((assignment) => toDateInput(assignment.shiftDate) === dateKey && assignment.shiftLabel === shift.label))
      .map((shift) => ({ date, dateKey, shift }));
  }).flat();
}

function getWeekHolidayNotifications() {
  const department = getNotificationDepartment();
  return Array.from({ length: 7 }, (_, index) => addDays(selectedWeekStart, index))
    .flatMap((date) =>
      getHolidayForDate(date).map((holiday) => ({
        key: `holiday-${department}-${holiday.date}-${holiday.title}`,
        type: "holiday",
        title: translatedText("חג/מועד השבוע"),
        text: `${formatDate(holiday.date)} - ${translatedText(holiday.title)}`,
      })),
    );
}

function getNotificationItems() {
  const department = getNotificationDepartment();
  const reminders = getUpcomingShiftReminders();
  const shortages = getStaffingShortages();
  const holidays = getWeekHolidayNotifications();
  return [
    ...holidays,
    ...reminders.map(({ assignment, startsAt }) => ({
      key: `reminder-${department}-${assignment.id}-${startsAt.toISOString()}`,
      type: "reminder",
      title: translatedText("תזכורת למשמרת קרובה"),
      text: translateTemplate("משמרת {shift} ביום {day}, {date}, מתחילה בשעה {time}.", {
        shift: translatedText(assignment.shiftLabel),
        day: formatDayName(startsAt),
        date: formatDate(startsAt),
        time: formatTime(startsAt),
      }),
    })),
    ...shortages.map(({ date, shift }) => ({
      key: `shortage-${department}-${toDateInput(date)}-${shift.label}`,
      type: "shortage",
      title: translatedText("חוסר בכוח אדם"),
      text: translateTemplate("משמרת {shift} ביום {day}, {date}, עדיין ללא עובד משובץ.", {
        shift: translatedText(shift.label),
        day: formatDayName(date),
        date: formatDate(date),
      }),
    })),
  ];
}

function renderNotifications() {
  if (!notificationList || !notificationBadge) return;
  const items = getNotificationItems();
  const readKeys = loadReadNotifications();
  const unreadCount = items.filter((item) => !readKeys.includes(item.key)).length;

  notificationList.innerHTML = items.length
    ? items
        .map(
          (item) => `
            <div class="notification-item ${item.type} ${readKeys.includes(item.key) ? "" : "unread"}">
              <span class="notification-dot"></span>
              <div>
                <strong>${item.title}</strong>
                <span>${item.text}</span>
              </div>
            </div>
          `,
        )
        .join("")
    : `<div class="notification-item clean"><strong>${translatedText("אין התראות פעילות כרגע.")}</strong><span>${translatedText("המערכת תעדכן כאן תזכורות וחוסרים לפי ההגדרות.")}</span></div>`;

  notificationBadge.textContent = String(unreadCount);
  notificationBadge.classList.toggle("hidden", unreadCount === 0 || !isAuthenticated);
  notificationButton?.classList.toggle("has-unread", unreadCount > 0 && isAuthenticated);
}

function openNotificationPopover() {
  const items = getNotificationItems();
  const readKeys = loadReadNotifications();
  notificationPopover.classList.remove("hidden");
  notificationButton.setAttribute("aria-expanded", "true");
  saveReadNotifications([...readKeys, ...items.map((item) => item.key)]);
  renderNotifications();
}

function closeNotificationPopover() {
  notificationPopover.classList.add("hidden");
  notificationButton.setAttribute("aria-expanded", "false");
}

function toggleNotificationPopover() {
  if (notificationPopover.classList.contains("hidden")) {
    openNotificationPopover();
    return;
  }
  closeNotificationPopover();
}

function toggleWeekStatsPanel(forceOpen = null) {
  const panel = document.querySelector("#weekStatsPanel");
  const toggle = document.querySelector("#weekStatsToggle");
  const shouldOpen = forceOpen ?? panel.classList.contains("hidden");
  panel.classList.toggle("hidden", !shouldOpen);
  toggle.setAttribute("aria-expanded", String(shouldOpen));
  if (shouldOpen) renderWeekStats();
}

function sendDueShiftReminders() {
  const settings = loadNotificationSettings();
  if (!settings.shiftReminders || !("Notification" in window) || Notification.permission !== "granted") return;
  const department = getNotificationDepartment();
  const now = new Date();
  const reminderWindow = new Date(now.getTime() + 60 * 60 * 1000);
  const sentKeys = loadSentNotifications();
  const nextSentKeys = [...sentKeys];

  notificationAssignments
    .filter((assignment) => (assignment.department || "NOC") === department)
    .filter((assignment) => isCurrentUserAssignment(assignment))
    .forEach((assignment) => {
      const startsAt = getAssignmentStart(assignment);
      if (startsAt <= now || startsAt > reminderWindow) return;
      const key = `${department}-${assignment.id}-${startsAt.toISOString()}`;
      if (sentKeys.includes(key)) return;
      new Notification(translatedText("תזכורת למשמרת קרובה"), {
        body: translateTemplate("משמרת {shift} ביום {day}, {date}, מתחילה בשעה {time}.", {
          shift: translatedText(assignment.shiftLabel),
          day: formatDayName(startsAt),
          date: formatDate(startsAt),
          time: formatTime(startsAt),
        }),
      });
      nextSentKeys.push(key);
    });

  if (nextSentKeys.length !== sentKeys.length) saveSentNotifications(nextSentKeys);
}

function toDateInput(date) {
  const parsed = parseDateOnly(date);
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateOnly(value) {
  if (value instanceof Date) return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeek(date) {
  const normalized = parseDateOnly(date);
  normalized.setHours(0, 0, 0, 0);
  normalized.setDate(normalized.getDate() - normalized.getDay());
  return normalized;
}

function addDays(date, days) {
  const next = parseDateOnly(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getHolidayForDate(date) {
  const dateKey = toDateInput(date);
  return jewishHolidays.filter((holiday) => holiday.date === dateKey);
}

async function ensureHolidaysForRange(startValue, endValue) {
  const start = toDateInput(startValue);
  const end = toDateInput(endValue);
  try {
    const holidays = await request(`/api/jewish-holidays?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`);
    const byKey = new Map(jewishHolidays.map((holiday) => [`${holiday.date}-${holiday.title}`, holiday]));
    holidays.forEach((holiday) => byKey.set(`${holiday.date}-${holiday.title}`, holiday));
    jewishHolidays = [...byKey.values()];
    return holidays;
  } catch (error) {
    console.warn("Payroll holidays could not be loaded", error);
    return [];
  }
}

function renderHolidayMarker(date) {
  const holidays = getHolidayForDate(date);
  if (!holidays.length) return "";
  const title = holidays.map((holiday) => translatedText(holiday.title)).join(", ");
  return `<span class="holiday-marker" title="${escapeHtml(title)}" aria-label="${escapeHtml(title)}">✡</span>`;
}

function currentLocale() {
  return localeByLanguage[currentLanguage] || "he-IL";
}

function formatDate(value) {
  return new Intl.DateTimeFormat(currentLocale(), { dateStyle: "short" }).format(parseDateOnly(value));
}

function formatDayName(value) {
  const label = new Intl.DateTimeFormat(currentLocale(), { weekday: "long" }).format(parseDateOnly(value));
  return currentLanguage === "he" ? label.replace(/^יום\s+/, "") : label;
}

function formatDateTime(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat(currentLocale(), { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

function formatTime(value) {
  if (!value) return "--:--";
  return new Intl.DateTimeFormat(currentLocale(), { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function formatDuration(start, end) {
  if (!start || !end) return "-";
  const totalMinutes = Math.max(0, Math.round((new Date(end) - new Date(start)) / 60000));
  return `${Math.floor(totalMinutes / 60)}:${String(totalMinutes % 60).padStart(2, "0")} ${translatedText("שעות")}`;
}

function getDurationHours(start, end) {
  if (!start || !end) return 0;
  return Math.max(0, (new Date(end) - new Date(start)) / 36e5);
}

function isSystemAdmin() {
  return currentUser.role === systemAdminRole;
}

function isManagerRole(role = currentUser.role) {
  return managerRoles.includes(role);
}

function isShiftLeadRole(role = currentUser.role) {
  return role === "אחראי/ת משמרת";
}

function canManageDepartmentSchedule(role = currentUser.role) {
  return isManagerRole(role) || isShiftLeadRole(role);
}

function isEmployeeRole(role = currentUser.role) {
  return employeeRoles.includes(role);
}

function getManagedDepartment() {
  return isSystemAdmin() ? selectedScheduleDepartment : currentUser.department || "NOC";
}

function getDepartmentShifts(department = getManagedDepartment()) {
  return department === "SOC" ? [...shifts, socMiddleShift] : shifts;
}

function getDepartmentShiftOrder(department = getManagedDepartment()) {
  return department === "SOC" ? [shifts[0], socMiddleShift, shifts[1], shifts[2]] : shifts;
}

function normalizeRoleForDepartment(role, department) {
  if (role === "מנהל/ת") return department === "SOC" ? "מנהל SOC" : "מנהל NOC";
  if (role === "עובד/ת") return department === "SOC" ? "Tier 1" : "NOC - משרה מלאה";
  if (role === systemAdminRole) return systemAdminRole;
  return role;
}

function getRoleOptions(department, selectedRole = "", includeSystemAdmin = false, preserveInvalidRole = true) {
  const normalized = normalizeRoleForDepartment(selectedRole, department);
  const options = [...(rolesByDepartment[department] || rolesByDepartment.NOC)];
  if (includeSystemAdmin) options.push(systemAdminRole);
  if (preserveInvalidRole && normalized && !options.includes(normalized)) options.unshift(normalized);
  return options
    .map((role) => `<option value="${escapeHtml(role)}" ${role === normalized ? "selected" : ""}>${escapeHtml(translatedText(role))}</option>`)
    .join("");
}

function getRegistrationRoleOptions(department, selectedRole = "") {
  const publicRoles = department === "SOC" ? ["Tier 1", "Tier 2"] : ["NOC - משרה מלאה", "NOC - משרה חלקית"];
  const normalized = normalizeRoleForDepartment(selectedRole, department);
  const selected = publicRoles.includes(normalized) ? normalized : publicRoles[0];
  return publicRoles
    .map((role) => `<option value="${escapeHtml(role)}" ${role === selected ? "selected" : ""}>${escapeHtml(translatedText(role))}</option>`)
    .join("");
}

function syncRoleSelectForDepartment(roleSelect, departmentSelect, includeSystemAdmin = false, preserveInvalidRole = true) {
  if (!roleSelect || !departmentSelect) return;
  roleSelect.innerHTML = getRoleOptions(departmentSelect.value, roleSelect.value, includeSystemAdmin, preserveInvalidRole);
}

function syncRegistrationRoleSelect() {
  if (!registerRole || !registerDepartment) return;
  registerRole.innerHTML = getRegistrationRoleOptions(registerDepartment.value, registerRole.value);
}

function getActiveUsers() {
  return users.filter((user) => user.status === "active" && isDepartmentTeamMember(user, getManagedDepartment()));
}

function isSystemAdminUser(user) {
  return normalizeRoleForDepartment(user?.role, user?.department || "NOC") === systemAdminRole;
}

function isDepartmentTeamMember(user, department) {
  return !isSystemAdminUser(user) && (user.department || "NOC") === department;
}

function getOpenAttendance() {
  const currentEmail = String(currentUser.email || "").trim().toLowerCase();
  return attendanceLog.find((entry) => String(entry.email || "").trim().toLowerCase() === currentEmail && !entry.clockOut);
}

function getPermissions() {
  const normalizedRole = normalizeRoleForDepartment(currentUser.role, currentUser.department || "NOC");
  return roleAccess[normalizedRole] || roleAccess[currentUser.role] || roleAccess["Tier 1"];
}

function canManageManualAttendance() {
  return canManageDepartmentSchedule();
}

function canEditWeeklySchedule() {
  return canManageDepartmentSchedule() && (isSystemAdmin() || selectedScheduleDepartment === (currentUser.department || "NOC"));
}

function can(action) {
  return getPermissions().actions.includes(action);
}

function canViewAllAvailability() {
  return canManageDepartmentSchedule();
}

function statusTag(status) {
  const labels = {
    active: "פעיל/ה",
    pending_verification: "ממתין לאימות",
    completed: "הושלם",
    open: "פעיל",
    approved: "מאושר",
    missing: "חסר",
    "זמין/ה": "זמין/ה",
    "לא זמין/ה": "לא זמין",
    "עדיפות נמוכה": "עדיפות נמוכה",
    "לא דווח": "לא זמין",
  };
  const label = labels[status] || status;
  const translated = translatedText(label);
  if (status === "missing" || status === "לא זמין/ה" || status === "לא דווח") return `<span class="tag danger">${translated}</span>`;
  if (status === "pending_verification" || status === "open" || status === "עדיפות נמוכה") return `<span class="tag warning">${translated}</span>`;
  return `<span class="tag">${translated}</span>`;
}

function availabilityDisplayStatus(status) {
  if (!status || status === "לא דווח" || status === "לא זמין/ה") return "לא זמין";
  return status;
}

function employeeColor(userId = "", email = "") {
  const sortedUsers = [...users].sort((a, b) => `${a.name}-${a.email}`.localeCompare(`${b.name}-${b.email}`, "he"));
  const userIndex = sortedUsers.findIndex((user) => user.id === userId || user.email === email);
  const seed =
    userIndex >= 0 ? userIndex : [...`${userId}-${email}`].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const hue = Math.round((seed * 137.508 + 24) % 360);
  const saturation = 58 + (seed % 3) * 7;
  const lightness = 31 + (seed % 2) * 6;
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

function renderEmployeeName(assignment) {
  const color = employeeColor(assignment.userId, assignment.email);
  const style = `style="--employee-color: ${color}"`;
  const className = "employee-name highlighted";
  return `<strong class="${className}" ${style}>${assignment.employee}</strong>`;
}

function getAssignmentUser(assignment) {
  const email = String(assignment.email || "").toLowerCase();
  return users.find((user) => user.id === assignment.userId || String(user.email || "").toLowerCase() === email);
}

function getAssignmentRoleBadge(assignment) {
  if ((assignment.department || getManagedDepartment()) !== "SOC") return "";
  const role = normalizeRoleForDepartment(assignment.role || getAssignmentUser(assignment)?.role || "", "SOC");
  const label = role.includes("מנהל") ? "מנהל" : role.includes("אחראי") || role === "Tier 2" ? "Tier 2" : "Tier 1";
  const badgeClass = label === "מנהל" ? "manager" : label === "Tier 2" ? "tier-two" : "tier-one";
  return `<span class="shift-tier-badge assignment-role-badge ${badgeClass}">${escapeHtml(translatedText(label))}</span>`;
}

function setWeeklyNotice(message) {
  setActionOutput(weeklyScheduleNotice, message);
}

function setActionOutput(element, message) {
  if (!element) return;
  element.textContent = isSystemAdmin() ? message : "";
}

function formatActualAttendanceTime(attendance) {
  const endLabel = attendance.clockOut ? formatTime(attendance.clockOut) : "פעיל";
  return `${formatTime(attendance.clockIn)}-${endLabel}`;
}

function getAttendanceTimeState(assignment) {
  const attendance = assignment.isManualAttendance ? assignment : findAttendanceForAssignment(assignment);
  if (!attendance) return null;
  const assignmentShifts = getDepartmentShifts(assignment.department || getManagedDepartment());
  const { start, end } = getShiftWindow(toDateInput(assignment.shiftDate), assignmentShifts.find((shift) => shift.label === assignment.shiftLabel)?.time || assignment.shiftTime);
  const clockIn = new Date(attendance.clockIn);
  const clockOut = attendance.clockOut ? new Date(attendance.clockOut) : null;
  const isOutOfRange = clockIn < start || (clockOut && clockOut > end);
  return {
    label: formatActualAttendanceTime(attendance),
    className: assignment.isManualAttendance || attendance.enteredBy ? "manual" : isOutOfRange ? "out-of-range" : "valid",
  };
}

function renderAssignmentTimeBadge(assignment) {
  const state = getAttendanceTimeState(assignment);
  const label = state?.label || assignment.shiftTime;
  const className = state?.className ? `actual-shift-time ${state.className}` : "actual-shift-time default";
  return `<span class="${className}">${escapeHtml(label)}</span>`;
}

function switchAuthMode(mode) {
  const isLogin = mode === "login";
  const isRegister = mode === "register";
  loginTab.classList.toggle("active", isLogin);
  registerTab.classList.toggle("active", isRegister);
  loginForm.classList.toggle("active", isLogin);
  registerForm.classList.toggle("active", isRegister);
  forgotPasswordForm.classList.toggle("active", mode === "forgot");
  loginNotice.textContent = "";
  registerNotice.textContent = "";
  forgotNotice.textContent = "";
}

function t(key) {
  return translations[currentLanguage]?.[key] || translations.he[key] || key;
}

function applyLanguage(language) {
  currentLanguage = language;
  localStorage.setItem("fastshift-language", language);
  document.documentElement.lang = language;
  document.documentElement.dir = language === "en" ? "ltr" : "rtl";
  document.querySelector("#languageSelect").value = language;

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.textContent = t(item.dataset.view);
  });
  document.querySelector(".eyebrow").textContent = t("appSubtitle");
  document.querySelectorAll(".setting-card h3").forEach((heading) => {
    const text = heading.textContent.trim();
    if (["התראות", "Notifications", "التنبيهات"].includes(text)) heading.textContent = t("notifications");
    if (["שפה", "Language", "اللغة"].includes(text)) heading.textContent = t("language");
    if (["תצוגה", "Display", "العرض"].includes(text)) heading.textContent = t("display");
    if (["גרסה נוכחית", "Current Version", "الإصدار الحالي"].includes(text)) heading.textContent = t("currentVersion");
  });
  const themeSelect = document.querySelector("#themeSelect");
  themeSelect.options[0].textContent = t("light");
  themeSelect.options[1].textContent = t("dark");
  viewTitle.textContent = t(document.querySelector(".nav-item.active")?.dataset.view || "weekly");
  const logoutText = translatedText("התנתקות");
  document.querySelector("#logoutButton").setAttribute("aria-label", logoutText);
  document.querySelector("#logoutButton").setAttribute("title", logoutText);
  document.querySelector("#logoutModalTitle").textContent = translatedText("האם אתה בטוח שאתה רוצה להתנתק?");
  document.querySelector("#cancelLogout").textContent = translatedText("לא");
  document.querySelector("#confirmLogout").textContent = translatedText("כן");
  updateLocalizedControls();
  document.querySelector("#closeNotifications").setAttribute("aria-label", translatedText("סגירה"));
  document.querySelector("#currentUserRole").textContent =
    currentUser.role === systemAdminRole
      ? "SOC/NOC"
      : currentUser.department || "NOC";
  if (isAuthenticated) {
    renderHome();
    renderSchedule();
    renderAssignmentSchedule();
    renderAvailabilitySchedule();
    renderAttendance();
    renderEmployees();
    renderPermissions();
    renderNotifications();
    renderReportUserSelect();
    if (can("reports") && isViewActive("reports")) void renderReports();
  }
  updateLocalizedControls();
  translateStaticContent();
}

function dictionaryKeyFor(text) {
  const normalized = text.trim();
  if (!normalized) return null;
  for (const [key, values] of Object.entries(uiDictionary)) {
    if (normalized === key || normalized === values.en || normalized === values.ar) return key;
  }
  return null;
}

function translatedText(text) {
  if (currentLanguage === "he") return dictionaryKeyFor(text) || text;
  const key = dictionaryKeyFor(text);
  return key ? uiDictionary[key][currentLanguage] || key : text;
}

function translateTemplate(heText, replacements = {}) {
  if (currentLanguage === "he") {
    return Object.entries(replacements).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, value), heText);
  }
  const templates = {
    "משמרת {shift} ביום {day}, {date}, מתחילה בשעה {time}.": {
      en: "{shift} shift on {day}, {date}, starts at {time}.",
      ar: "وردية {shift} يوم {day}، {date}، تبدأ الساعة {time}.",
    },
    "משמרת {shift} ביום {day}, {date}, עדיין ללא עובד משובץ.": {
      en: "{shift} shift on {day}, {date} still has no assigned employee.",
      ar: "وردية {shift} يوم {day}، {date} لا يوجد لها موظف معين بعد.",
    },
  };
  const template = templates[heText]?.[currentLanguage] || heText;
  return Object.entries(replacements).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, value), template);
}

function assignmentLine(label, assignment) {
  const shift = translatedText(assignment.shiftLabel);
  return currentLanguage === "he"
    ? `${label}: ${formatDate(assignment.shiftDate)} · ${shift} ${assignment.shiftTime}`
    : `${label}: ${formatDate(assignment.shiftDate)} · ${shift} ${assignment.shiftTime}`;
}

function userLabel(user) {
  return user?.name || translatedText("עובד/ת");
}

function translateStaticContent() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
      if (["SCRIPT", "STYLE"].includes(node.parentElement?.tagName)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    const original = node.textContent;
    const translated = translatedText(original);
    if (translated !== original.trim()) node.textContent = original.replace(original.trim(), translated);
  });

  document.querySelectorAll("input[placeholder]").forEach((input) => {
    input.placeholder = translatedText(input.placeholder);
  });
  document.querySelectorAll("option").forEach((option) => {
    option.textContent = translatedText(option.textContent);
  });
}

function updateLocalizedControls() {
  const controls = [
    ["#availabilitySubmit", "עדכון זמינות"],
    ["#editEmployees", "עריכה"],
    ["#saveEmployeeDetails", "עידכון פרטים"],
    ["#exportEmployees", "ייצוא רשימה"],
    ["#editWeeklySchedule", "עריכה"],
    ["#saveWeeklyScheduleEdits", "שמירה"],
    ["#cancelWeeklyScheduleEdits", "ביטול"],
    ["#publishSchedule", "פרסום סידור"],
    ["#clearAttendance", "ניקוי תיעוד"],
    ["#generateReport", "הפקת דוח שעות"],
    ["#calculatePayroll", "חישוב שכר"],
    ["#showShiftReport", "הצגת משמרות"],
    ["#saveAttendanceDeletes", "שמירת מחיקות"],
    ["#cancelAttendanceDeletes", "ביטול"],
  ];
  controls.forEach(([selector, key]) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = translatedText(key);
  });
  document.querySelector(".sidebar-brand small").textContent = `${translatedText("גרסה")} 1.0.0`;
}

function updateCurrentUser(email) {
  const user = users.find((item) => item.email === email && item.status === "active");
  if (!user) return false;
  currentUser = {
    ...user,
    role: normalizeRoleForDepartment(user.role, user.department || "NOC"),
    department: user.department || "NOC",
  };
  selectedScheduleDepartment = currentUser.role === systemAdminRole ? selectedScheduleDepartment || "NOC" : currentUser.department || "NOC";
  localStorage.setItem("fastshift-schedule-department", selectedScheduleDepartment);
  document.querySelector("#currentUserName").textContent = currentUser.name;
  document.querySelector("#currentUserRole").textContent =
    currentUser.role === systemAdminRole
      ? "SOC/NOC"
      : currentUser.department || "NOC";
  applyRoleAccess();
  return true;
}

async function enterApp(event) {
  event.preventDefault();
  const email = document.querySelector("#loginEmail").value.trim().toLowerCase();
  const password = document.querySelector("#loginPassword").value;
  await completeLogin(email, password);
}

async function requestPasswordReset(event) {
  event.preventDefault();
  const email = document.querySelector("#forgotEmail").value.trim().toLowerCase();
  forgotNotice.textContent = "";

  try {
    const result = await request("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    forgotNotice.textContent = "אם המייל קיים במערכת, נשלח אליו קישור לבחירת סיסמה חדשה.";
  } catch (error) {
    forgotNotice.textContent = error.message || "לא ניתן לשלוח קישור איפוס כרגע.";
  }
}

async function enterAuthenticatedApp(user, restoreLastView = false) {
  currentUser = user;
  await loadUsers();
  if (!updateCurrentUser(user.email)) {
    loginNotice.textContent = "לא נמצא משתמש פעיל עם האימייל הזה. יש לאמת את המשתמש לפני התחברות.";
    return;
  }
  isAuthenticated = true;
  localStorage.setItem(sessionKeys.email, currentUser.email);
  sessionStorage.setItem(sessionKeys.activeBrowserSession, currentUser.email);
  sessionStorage.setItem(sessionKeys.authToken, authToken);
  await refreshAll();
  loginNotice.textContent = "";
  authShell.classList.add("hidden");
  appShell.classList.remove("hidden");
  switchView(restoreLastView ? localStorage.getItem(sessionKeys.view) || getPermissions().views[0] : getPermissions().views[0]);
  renderAttendance();
}

async function completeLogin(email, password = "") {
  try {
    const result = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    authToken = result.token || "";
    await enterAuthenticatedApp(result.user, false);
  } catch (error) {
    loginNotice.textContent = "אימייל או סיסמה שגויים, או שהמשתמש עדיין לא אומת.";
  }
}

function applyRoleAccess() {
  const permissions = getPermissions();
  document.body.classList.toggle("hide-action-output", !isSystemAdmin());
  document.querySelectorAll(".nav-item").forEach((item) => {
    if (!item.dataset.view) return;
    item.classList.toggle("hidden", !permissions.views.includes(item.dataset.view));
  });
  document.querySelector("#publishSchedule").classList.toggle("hidden", !can("publishSchedule"));
  document.querySelector("#assignmentControls").classList.toggle("hidden", !can("schedule"));
  document.querySelector("#availabilityUserField").classList.toggle("hidden", !canViewAllAvailability());
  document.querySelector("#reportUserField").classList.toggle("hidden", !isManagerRole());
  document.querySelector("#attendanceUserField").classList.toggle("hidden", !isManagerRole());
  employeeDepartmentField?.classList.toggle("hidden", !isSystemAdmin());
  if (employeeDepartmentSelect) employeeDepartmentSelect.value = selectedScheduleDepartment;
  manualAttendanceForm?.classList.add("hidden");
  staffingShortageRow.classList.toggle("hidden", !can("schedule"));
  document.querySelector("#exportEmployees").classList.toggle("hidden", !can("exportEmployees"));
  document.querySelector("#clearAttendance").classList.toggle("hidden", !can("clearAttendance") || attendanceDeleteMode);
  document.querySelector("#attendanceDeleteActions")?.classList.toggle("hidden", !attendanceDeleteMode || !can("clearAttendance"));
  editWeeklySchedule.classList.toggle("hidden", !canEditWeeklySchedule());
  saveWeeklyScheduleEdits.classList.toggle("hidden", !weeklyEditMode || !canEditWeeklySchedule());
  cancelWeeklyScheduleEdits.classList.toggle("hidden", !weeklyEditMode || !canEditWeeklySchedule());
  if (newUserDepartment) {
    newUserDepartment.disabled = !isSystemAdmin();
    newUserDepartment.value = isSystemAdmin() ? getManagedDepartment() : currentUser.department || "NOC";
    syncRoleSelectForDepartment(newUserRole, newUserDepartment, isSystemAdmin(), false);
  }
  document.querySelectorAll("[data-verify-user], [data-role-user]").forEach((item) => {
    item.disabled = !can("manageUsers");
  });
  document.querySelector("#logoutButton").classList.remove("hidden");
}

function renderWeekLabel() {
  const end = addDays(selectedWeekStart, 6);
  document.querySelector("#weekRangeLabel").textContent = `${formatDate(selectedWeekStart)}-${formatDate(end)}`;
  document.querySelector("#assignWeekRangeLabel").textContent = `${formatDate(selectedWeekStart)}-${formatDate(end)}`;
  document.querySelector("#availabilityWeekRangeLabel").textContent = `${formatDate(selectedWeekStart)}-${formatDate(end)}`;
  if (scheduleDepartmentSelect) scheduleDepartmentSelect.value = selectedScheduleDepartment;
  if (employeeDepartmentSelect) employeeDepartmentSelect.value = selectedScheduleDepartment;
}

function renderSchedule() {
  renderWeekLabel();
  renderUserSelects();
  applyRoleAccess();
  const grid = document.querySelector("#scheduleGrid");
  const isFuture = selectedWeekStart > startOfWeek(new Date());
  const manualAssignments = getManualAttendanceAssignments(currentSchedule.assignments);

  if (!currentSchedule.published && !manualAssignments.length) {
    grid.innerHTML = `<section class="day-column empty-week"><strong>${translatedText(isFuture ? "לא פורסם עדיין סידור" : "לא פורסם עדיין סידור לשבוע הזה")}</strong><span>${translatedText("לאחר פרסום הסידור בעמוד שיבוץ עובדים, הוא יופיע כאן.")}</span></section>`;
    return;
  }

  grid.innerHTML = buildScheduleColumns(weeklyEditMode && canEditWeeklySchedule(), { mode: "weekly" });
}

function renderAssignmentSchedule() {
  renderWeekLabel();
  renderUserSelects();
  const grid = document.querySelector("#assignmentScheduleGrid");
  grid.innerHTML = buildScheduleColumns(true, { mode: "scheduling" });
  renderWeekStats();
  renderSchedulingAvailability();
}

function getVisibleAssignmentDraft() {
  const serverAssignments = currentSchedule.published ? currentSchedule.assignments.filter((assignment) => !isRemovedAssignment(assignment)) : [];
  return [...serverAssignments, ...getCurrentDraftAssignments()];
}

function getVisibleAssignmentsWithManual() {
  const visibleAssignments = getVisibleAssignmentDraft();
  return [...visibleAssignments, ...getManualAttendanceAssignments(visibleAssignments)];
}

function getPublishedAssignmentsWithManual() {
  const publishedAssignments = currentSchedule.published ? currentSchedule.assignments : [];
  return [...publishedAssignments, ...getManualAttendanceAssignments(publishedAssignments)];
}

function findEditableAssignment(assignmentId) {
  return getVisibleAssignmentsWithManual().find((assignment) => assignment.id === assignmentId);
}

function confirmAssignmentRemoval(assignment) {
  const date = parseDateOnly(assignment.shiftDate);
  const dayName = translatedText(dayNames[date.getDay()] || "");
  const message =
    currentLanguage === "he"
      ? `האם אתה בטוח שתרצה להסיר את ${assignment.employee || "העובד/ת"} ממשמרת ${assignment.shiftLabel} ביום ${dayName}.`
      : `Are you sure you want to remove ${assignment.employee || "the employee"} from the ${translatedText(assignment.shiftLabel)} shift on ${dayName}?`;
  return window.confirm(message);
}

function removeAssignmentFromDraft(assignmentId, options = {}) {
  const assignment = findEditableAssignment(assignmentId);
  if (!assignment) return false;
  if (options.confirm !== false && !confirmAssignmentRemoval(assignment)) return false;

  if (assignment.isManualAttendance) {
    const attendanceId = String(assignment.id).replace(/^manual-/, "");
    request(`/api/attendance/${attendanceId}`, { method: "DELETE" })
      .then(async () => {
        setActionOutput(scheduleNotice, "רשומת הנוכחות הידנית הוסרה.");
        await refreshAll();
      })
      .catch((error) => {
        setActionOutput(scheduleNotice, error.message);
      });
  } else if (assignment.isDraft || String(assignment.id).startsWith("draft-")) {
    setCurrentDraftAssignments(getCurrentDraftAssignments().filter((item) => item.id !== assignmentId));
    setActionOutput(scheduleNotice, "השיבוץ הוסר מהטיוטה.");
  } else {
    setCurrentDraftRemovals([...new Set([...getCurrentDraftRemovals(), assignmentId])]);
    setActionOutput(scheduleNotice, "השיבוץ הוסר מהטיוטה. הפרסום יעדכן את הסידור בכל המקומות הרלוונטיים.");
  }

  renderAssignmentSchedule();
  renderSchedulingAvailability();
  renderWeekStats();
  translateStaticContent();
  return true;
}

function removeWeeklyAssignment(assignmentId) {
  const assignment = getPublishedAssignmentsWithManual().find((item) => item.id === assignmentId);
  if (!assignment) return false;
  if (!confirmAssignmentRemoval(assignment)) return false;
  if (assignment.isManualAttendance) {
    weeklyEditAttendanceRemovals.add(String(assignment.id).replace(/^manual-/, ""));
  } else {
    weeklyEditRemovals.add(assignmentId);
  }
  setWeeklyNotice("השיבוץ סומן להסרה. לחץ/י שמירה כדי לעדכן בפועל.");
  renderSchedule();
  translateStaticContent();
  return true;
}

function getWeeklyManualEditKey(assignment) {
  return `${assignment.userId}|${toDateInput(assignment.shiftDate)}|${assignment.shiftLabel}`;
}

function getWeeklyEditTimes(assignment) {
  const saved = weeklyManualEdits.get(getWeeklyManualEditKey(assignment));
  if (saved) return saved;
  const attendance = findAttendanceForAssignment(assignment);
  if (attendance?.clockIn && attendance?.clockOut) {
    return { clockIn: formatTime(attendance.clockIn), clockOut: formatTime(attendance.clockOut) };
  }
  const [clockIn, clockOut] = assignment.shiftTime.split("-");
  return { clockIn, clockOut };
}

function updateWeeklyManualEdit(input) {
  const assignment = getPublishedAssignmentsWithManual().find((item) => item.id === input.dataset.weeklyEditAssignment);
  if (!assignment || !assignment.userId) return;
  const key = getWeeklyManualEditKey(assignment);
  const current = getWeeklyEditTimes(assignment);
  weeklyManualEdits.set(key, { ...current, [input.dataset.weeklyEditField]: input.value });
  setWeeklyNotice("השעות עודכנו בטיוטת העריכה. לחץ/י שמירה כדי לעדכן בפועל.");
}

function closeTimePickerWhenComplete(input) {
  if (/^\d{2}:\d{2}$/.test(input.value)) {
    window.setTimeout(() => input.blur(), 40);
  }
}

function getManualAttendanceAssignments(baseAssignments = []) {
  const weekEnd = addDays(selectedWeekStart, 6);
  return attendanceLog
    .filter((entry) => entry.shiftLabel && entry.clockOut)
    .filter((entry) => (entry.department || "NOC") === selectedScheduleDepartment)
    .filter((entry) => {
      const entryDate = parseDateOnly(entry.clockIn);
      return entryDate >= selectedWeekStart && entryDate <= weekEnd;
    })
    .filter((entry) => {
      const entryDate = toDateInput(entry.clockIn);
      const entryEmail = String(entry.email || "").toLowerCase();
      return !baseAssignments.some(
        (assignment) =>
          toDateInput(assignment.shiftDate) === entryDate &&
          assignment.shiftLabel === entry.shiftLabel &&
          String(assignment.email || "").toLowerCase() === entryEmail,
      );
    })
    .map((entry) => ({
      id: `manual-${entry.id}`,
      userId: entry.userId,
      employee: entry.employee,
      email: entry.email,
      department: entry.department || selectedScheduleDepartment,
      shiftDate: toDateInput(entry.clockIn),
      shiftLabel: entry.shiftLabel,
      shiftTime: `${formatTime(entry.clockIn)}-${entry.clockOut ? formatTime(entry.clockOut) : "פעיל"}`,
      clockIn: entry.clockIn,
      clockOut: entry.clockOut,
      isManualAttendance: true,
    }));
}

function getWeekAssignmentStats() {
  const stats = new Map();
  const visibleAssignments = getVisibleAssignmentDraft();
  [...visibleAssignments, ...getManualAttendanceAssignments(visibleAssignments)].forEach((assignment) => {
    const key = assignment.userId || assignment.email || assignment.employee;
    if (!stats.has(key)) {
      stats.set(key, {
        employee: assignment.employee || "עובד/ת",
        total: 0,
        morning: 0,
        evening: 0,
        night: 0,
        middle: 0,
      });
    }
    const row = stats.get(key);
    row.total += 1;
    if (assignment.shiftLabel === "בוקר") row.morning += 1;
    if (assignment.shiftLabel === "ערב") row.evening += 1;
    if (assignment.shiftLabel === "לילה") row.night += 1;
    if (assignment.shiftLabel === "אמצע") row.middle += 1;
  });
  return [...stats.values()].sort((a, b) => b.total - a.total || a.employee.localeCompare(b.employee, "he"));
}

function renderWeekStats() {
  const content = document.querySelector("#weekStatsContent");
  const subtitle = document.querySelector("#weekStatsSubtitle");
  if (!content || !subtitle) return;
  const stats = getWeekAssignmentStats();
  const isSocStats = getManagedDepartment() === "SOC";

  subtitle.textContent = `${formatDate(selectedWeekStart)}-${formatDate(addDays(selectedWeekStart, 6))}`;
  content.innerHTML = stats.length
    ? `
      <div class="week-stats-row week-stats-labels ${isSocStats ? "soc-stats-row" : ""}">
        <strong>${translatedText("עובד/ת")}</strong>
        <span>${translatedText("בוקר")}</span>
        <span>${translatedText("ערב")}</span>
        <span>${translatedText("לילה")}</span>
        ${isSocStats ? `<span>${translatedText("אמצע")}</span>` : ""}
        <span>${translatedText("סה״כ")}</span>
      </div>
      <div class="week-stats-table">
        ${stats
          .map(
            (row) => `
              <div class="week-stats-row ${isSocStats ? "soc-stats-row" : ""}">
                <strong>${escapeHtml(row.employee)}</strong>
                <span>${row.morning}</span>
                <span>${row.evening}</span>
                <span>${row.night}</span>
                ${isSocStats ? `<span>${row.middle}</span>` : ""}
                <span>${row.total}</span>
              </div>
            `,
          )
          .join("")}
      </div>
    `
    : `<div class="home-empty">${translatedText("אין שיבוצים להצגה בשבוע הנבחר.")}</div>`;
}

function buildScheduleColumns(canEdit, options = {}) {
  const mode = options.mode || "weekly";
  const isWeeklyEdit = mode === "weekly" && canEdit;
  const isSchedulingEdit = mode === "scheduling" && canEdit;
  const department = currentSchedule.department || selectedScheduleDepartment || getManagedDepartment();
  const departmentShifts = getDepartmentShifts(department);
  return Array.from({ length: 7 }, (_, dayIndex) => {
    const date = addDays(selectedWeekStart, dayIndex);
    const dateKey = toDateInput(date);
    const baseAssignments = isSchedulingEdit ? getVisibleAssignmentDraft() : currentSchedule.assignments;
    const sourceAssignments = [...baseAssignments, ...getManualAttendanceAssignments(baseAssignments)];
    const dayAssignments = sourceAssignments.filter((assignment) => toDateInput(assignment.shiftDate) === dateKey);
    const shiftCards = departmentShifts
      .map((shift) => {
        const assigned = dayAssignments.filter((assignment) => assignment.shiftLabel === shift.label);
        const isSelected = selectedAssignmentSlot?.date === dateKey && selectedAssignmentSlot?.shiftLabel === shift.label;
        const visibleAssigned = assigned.filter(
          (assignment) =>
            !isWeeklyEdit ||
            (!weeklyEditRemovals.has(assignment.id) && !weeklyEditAttendanceRemovals.has(String(assignment.id).replace(/^manual-/, ""))),
        );
        const displayTime = visibleAssigned.length ? "" : `<span>${shift.time}</span>`;
        const names = visibleAssigned.length
          ? visibleAssigned
              .map(
                (assignment) => {
                  const editTimes = isWeeklyEdit ? getWeeklyEditTimes(assignment) : null;
                  return `
                    <span class="assignment-name ${isWeeklyEdit ? "weekly-edit-row" : ""}">
                      <span class="assignment-details">
                        ${renderAssignmentTimeBadge(assignment)}
                        ${renderEmployeeName(assignment)}
                        ${
                          editTimes
                                ? `<span class="weekly-time-edit">
                                <label>
                                  <small>${translatedText("כניסה")}</small>
                                  <input type="time" data-weekly-edit-assignment="${assignment.id}" data-weekly-edit-field="clockIn" value="${escapeHtml(editTimes.clockIn)}" aria-label="כניסה ${escapeHtml(assignment.employee || "")}" />
                                </label>
                                <label>
                                  <small>${translatedText("יציאה")}</small>
                                  <input type="time" data-weekly-edit-assignment="${assignment.id}" data-weekly-edit-field="clockOut" value="${escapeHtml(editTimes.clockOut)}" aria-label="יציאה ${escapeHtml(assignment.employee || "")}" />
                                </label>
                              </span>`
                            : ""
                        }
                      </span>
                      ${assignment.isDraft ? `<small class="draft-label">${translatedText("טיוטה")}</small>` : ""}
                      ${assignment.isManualAttendance ? `<small class="manual-label">${translatedText("ידני")}</small>` : ""}
                      ${
                        isWeeklyEdit
                          ? `<button class="remove-assignment-button" type="button" data-weekly-delete-assignment="${assignment.id}" aria-label="הסרת ${escapeHtml(assignment.employee || "עובד/ת")} ממשמרת ${escapeHtml(assignment.shiftLabel)}">×</button>`
                          : isSchedulingEdit
                            ? `<button class="remove-assignment-button" type="button" data-delete-assignment="${assignment.id}" aria-label="הסרת ${escapeHtml(assignment.employee || "עובד/ת")} ממשמרת ${escapeHtml(assignment.shiftLabel)}">×</button>`
                          : ""
                      }
                    </span>
                  `;
                },
              )
              .join("")
          : `<span>${translatedText("לא שובץ עובד")}</span>`;
        return `
          ${shift.dividerBefore ? `<div class="shift-section-divider"><span>${translatedText("משמרת אמצע")}</span></div>` : ""}
          <article
            class="shift-pill ${shift.className} ${isSelected ? "selected-shift" : ""}"
            ${isSchedulingEdit ? `data-select-shift data-shift-date="${dateKey}" data-shift-label="${shift.label}" data-shift-time="${shift.time}"` : ""}
          >
            <div class="shift-pill-header">
              <strong>${translatedText(shift.label)}</strong>
              ${visibleAssigned.length ? `<span class="shift-role-badges">${visibleAssigned.map((assignment) => getAssignmentRoleBadge(assignment)).join("")}</span>` : ""}
            </div>
            ${displayTime ? `<small class="shift-time-row">${displayTime}</small>` : ""}
            ${names}
          </article>
        `;
      })
      .join("");

    return `
      <section class="day-column">
        <div class="day-header">
          <strong>${translatedText(dayNames[dayIndex])}</strong>
          <span class="day-date">${formatDate(date)} ${renderHolidayMarker(date)}</span>
        </div>
        ${shiftCards}
      </section>
    `;
  }).join("");
}

function renderUserSelects() {
  const activeUsers = getActiveUsers();
  const selectableUsers = canViewAllAvailability() ? activeUsers : activeUsers.filter((user) => user.email === currentUser.email);
  const availabilitySelect = document.querySelector("#availabilityUser");
  const selectedAvailabilityUser = availabilitySelect.value;
  const options = selectableUsers.map((user) => `<option value="${user.id}">${user.name}</option>`).join("");
  const empty = `<option value="">${translatedText("אין עובדים פעילים")}</option>`;
  availabilitySelect.innerHTML = options || empty;
  if (selectableUsers.some((user) => user.id === selectedAvailabilityUser)) availabilitySelect.value = selectedAvailabilityUser;
  if (!canViewAllAvailability()) {
    const ownUser = selectableUsers.find((user) => user.email === currentUser.email);
    if (ownUser) availabilitySelect.value = ownUser.id;
  }
}

function renderReportUserSelect() {
  const activeUsers = getActiveUsers();
  const selectedUser = reportUser.value;
  const options = activeUsers.map((user) => `<option value="${user.id}">${user.name}</option>`).join("");
  reportUser.innerHTML = `<option value="">${translatedText("כל העובדים")}</option>${options}`;
  if (activeUsers.some((user) => user.id === selectedUser)) reportUser.value = selectedUser;
}

function renderAttendanceUserSelect() {
  const activeUsers = getActiveUsers();
  const selectedUser = attendanceUser.value;
  const options = activeUsers.map((user) => `<option value="${user.id}">${user.name}</option>`).join("");
  attendanceUser.innerHTML = `<option value="">${translatedText("כל העובדים")}</option>${options}`;
  if (activeUsers.some((user) => user.id === selectedUser)) attendanceUser.value = selectedUser;

  if (manualAttendanceUser) {
    const selectedManualUser = manualAttendanceUser.value;
    manualAttendanceUser.innerHTML = options || `<option value="">${translatedText("אין עובדים פעילים")}</option>`;
    if (activeUsers.some((user) => user.id === selectedManualUser)) manualAttendanceUser.value = selectedManualUser;
  }
}

function renderAssignments() {
  renderAvailabilitySchedule();
}

function renderSchedulingAvailability() {
  const panel = document.querySelector("#assignmentSidePanel");
  const list = document.querySelector("#schedulingAvailabilityList");
  if (!selectedAssignmentSlot) {
    panel.querySelector("h3").textContent = translatedText("בחר/י משמרת בטבלה");
    panel.querySelector(".save-note").textContent = translatedText("לאחר בחירת משמרת תוצג כאן רשימת עובדים לפי זמינות.");
    list.innerHTML = "";
    return;
  }

  const visibleAssignments = getVisibleAssignmentDraft();
  const visibleAssignmentsWithManual = getVisibleAssignmentsWithManual();
  const activeUsers = getActiveUsers();
  const availabilityRank = {
    "זמין/ה": 0,
    "עדיפות נמוכה": 1,
    "לא דווח": 3,
    "לא זמין/ה": 3,
  };
  const rows = activeUsers
    .map((user) => {
      const availability = getAvailabilityEntry(user.id, selectedAssignmentSlot.date, selectedAssignmentSlot.shiftLabel);
      const status = availability?.status || "לא זמין/ה";
      const note = availability?.note || "";
      const assigned = visibleAssignmentsWithManual.some((assignment) =>
        isSameAssignmentSlot(assignment, selectedAssignmentSlot.date, selectedAssignmentSlot.shiftLabel, user.id),
      );
      const manualAssigned = visibleAssignmentsWithManual.some(
        (assignment) => assignment.isManualAttendance && isSameAssignmentSlot(assignment, selectedAssignmentSlot.date, selectedAssignmentSlot.shiftLabel, user.id),
      );
      return { user, status, note, assigned, manualAssigned, rank: availabilityRank[status] ?? 2 };
    })
    .sort((a, b) => a.rank - b.rank || a.user.name.localeCompare(b.user.name, "he"))
    .map(
      ({ user, status, note, assigned, manualAssigned }) => `
        <button
          class="employee-pick ${assigned ? "selected assignment-locked" : ""} ${manualAssigned ? "manual-locked" : ""}"
          type="button"
          data-pick-user="${user.id}"
          ${assigned ? `disabled title="${manualAssigned ? "לעובד/ת כבר הוזנו שעות ידנית למשמרת הזו" : "העובד/ת כבר משובץ/ת למשמרת הזו. הסרה מתבצעת בסידור השבועי במצב עריכה."}"` : ""}
        >
          <span>
            <strong>${user.name}</strong>
            <small>${translatedText(user.role)}</small>
            ${manualAssigned ? `<small class="manual-label">${translatedText("כבר הוזן ידנית")}</small>` : ""}
            ${note ? `<small class="availability-note-preview">${translatedText("הערה למשמרת")}: ${escapeHtml(note)}</small>` : ""}
          </span>
          ${statusTag(status)}
        </button>
      `,
    )
    .join("");

  panel.querySelector("h3").textContent = `${translatedText(selectedAssignmentSlot.shiftLabel)} · ${formatDate(selectedAssignmentSlot.date)}`;
  panel.querySelector(".save-note").textContent = translatedText("הרשימה ממוינת לפי זמינות העובדים למשמרת שנבחרה.");
  list.innerHTML = rows || `<div class="list-item"><strong>${translatedText("אין עובדים פעילים לשיבוץ.")}</strong><span class="tag">0</span></div>`;
}

function renderAvailabilitySchedule() {
  renderWeekLabel();
  renderUserSelects();
  const grid = document.querySelector("#availabilityScheduleGrid");
  const userId = document.querySelector("#availabilityUser").value;
  const selectedUser = users.find((user) => user.id === userId);
  const departmentShifts = getDepartmentShifts(selectedUser?.department || getManagedDepartment());
  const canEditAvailability = selectedUser?.email === currentUser.email;
  document.querySelector("#availabilitySubmit").classList.toggle("hidden", !canEditAvailability);
  grid.innerHTML = Array.from({ length: 7 }, (_, dayIndex) => {
    const date = addDays(selectedWeekStart, dayIndex);
    const dateKey = toDateInput(date);
    const shiftCards = departmentShifts
      .map((shift) => {
        const availability = userId ? getAvailabilityEntry(userId, dateKey, shift.label) : null;
        const availabilityStatus = availability?.status || "לא זמין/ה";
        const displayStatus = availabilityDisplayStatus(availabilityStatus);
        const availabilityNote = availability?.note || "";
        const isChecked = availabilityStatus === "זמין/ה";
        const statusClass = isChecked
          ? "available"
          : availabilityStatus === "לא זמין/ה"
            || availabilityStatus === "לא דווח"
            ? "unavailable"
            : availabilityStatus === "עדיפות נמוכה"
              ? "low-priority"
              : "unavailable";
        return `
          ${shift.dividerBefore ? `<div class="shift-section-divider"><span>${translatedText("משמרת אמצע")}</span></div>` : ""}
          <article class="shift-pill ${shift.className} ${isChecked ? "availability-available-card" : ""}">
            <div class="shift-pill-header">
              <strong>${translatedText(shift.label)}</strong>
              ${
                canEditAvailability
                  ? `<label class="shift-checkbox" title="סימון זמינות למשמרת">
                      <input type="checkbox" data-availability-toggle data-shift-date="${dateKey}" data-shift-label="${shift.label}" ${isChecked ? "checked" : ""} />
                      <span></span>
                    </label>`
                  : ""
              }
            </div>
            <small>${shift.time}</small>
            <span class="availability-status ${statusClass}">${translatedText(displayStatus)}</span>
            ${
              canEditAvailability
                ? `<textarea class="availability-note-input" data-availability-note data-shift-date="${dateKey}" data-shift-label="${shift.label}" placeholder="${translatedText("הערה למשמרת")}">${escapeHtml(availabilityNote)}</textarea>`
                : availabilityNote
                  ? `<p class="availability-note-preview">${translatedText("הערה למשמרת")}: ${escapeHtml(availabilityNote)}</p>`
                  : ""
            }
          </article>
        `;
      })
      .join("");

    return `
      <section class="day-column">
        <div class="day-header">
          <strong>${translatedText(dayNames[dayIndex])}</strong>
          <span class="day-date">${formatDate(date)} ${renderHolidayMarker(date)}</span>
        </div>
        ${shiftCards}
      </section>
    `;
  }).join("");
}

function getUserHours(email) {
  return attendanceLog
    .filter((entry) => entry.email === email && entry.clockOut)
    .reduce((sum, entry) => sum + getDurationHours(entry.clockIn, entry.clockOut), 0);
}

function getUserForRecord(record) {
  const recordUserId = String(record.userId || "").trim();
  const recordEmail = String(record.email || "").trim().toLowerCase();
  return users.find(
    (user) =>
      (recordUserId && user.id === recordUserId) ||
      (recordEmail && String(user.email || "").trim().toLowerCase() === recordEmail),
  );
}

function getRecordEmploymentStatus(record) {
  const value = getUserForRecord(record)?.employmentStatus || record.employmentStatus || "משרה מלאה";
  if (String(value).includes("×")) return "משרה מלאה";
  return value;
}

function getRecordEmployeeNumber(record) {
  return getUserForRecord(record)?.employeeNumber || record.employeeNumber || "-";
}

function renderEmployees(list = users) {
  if (!can("viewEmployees")) {
    document.querySelector("#employeeRows").innerHTML = `<tr><td colspan="7">אין הרשאה לצפייה ברשימת העובדים.</td></tr>`;
    return;
  }
  document.querySelector("#editEmployees").classList.toggle("hidden", !can("manageUsers"));
  document.querySelector("#saveEmployeeDetails").classList.toggle("hidden", !can("manageUsers") || !employeeEditMode);
  const rows = list
    .filter((user) => user.status === "active" && (isSystemAdmin() ? isDepartmentTeamMember(user, selectedScheduleDepartment) : isDepartmentTeamMember(user, currentUser.department || "NOC")))
    .map(
      (user) => `
        <tr>
          <td>${employeeEditMode ? `<input class="table-input" data-employee-field="name" data-employee-user="${user.id}" value="${escapeHtml(user.name)}" />` : `<strong>${escapeHtml(user.name)}</strong>`}</td>
          <td>${employeeEditMode ? `<input class="table-input" data-employee-field="employeeNumber" data-employee-user="${user.id}" value="${escapeHtml(user.employeeNumber || "")}" />` : escapeHtml(user.employeeNumber || "-")}</td>
          <td>
            ${
              employeeEditMode
                ? `<select class="compact-select" data-employee-field="role" data-employee-user="${user.id}">
                    ${getRoleOptions(user.department || "NOC", user.role, isSystemAdmin())}
                  </select>`
                : escapeHtml(translatedText(user.role))
            }
          </td>
          <td>${employeeEditMode ? `<input class="table-input" data-employee-field="email" data-employee-user="${user.id}" value="${escapeHtml(user.email)}" />` : escapeHtml(user.email)}</td>
          <td>${employeeEditMode ? `<input class="table-input" data-employee-field="phone" data-employee-user="${user.id}" value="${escapeHtml(user.phone || "")}" />` : escapeHtml(user.phone || "-")}</td>
          <td>
            ${
              employeeEditMode
                ? `<select class="compact-select" data-employee-field="employmentStatus" data-employee-user="${user.id}">
                    <option value="משרה חלקית" ${user.employmentStatus === "משרה חלקית" ? "selected" : ""}>${translatedText("משרה חלקית")}</option>
                    <option value="משרה מלאה" ${user.employmentStatus !== "משרה חלקית" ? "selected" : ""}>${translatedText("משרה מלאה")}</option>
                  </select>`
                : escapeHtml(translatedText(user.employmentStatus || "משרה מלאה"))
            }
          </td>
          <td>${getUserHours(user.email).toFixed(1)}</td>
        </tr>
      `,
    )
    .join("");
  document.querySelector("#employeeRows").innerHTML =
    rows || `<tr><td colspan="7">אין עובדים פעילים. צור משתמש ואמת אותו כדי שיופיע כאן.</td></tr>`;
}

function getVisibleEmployeeList() {
  const query = document.querySelector("#employeeSearch").value.trim();
  return users
    .filter((user) => user.status === "active" && (isSystemAdmin() ? isDepartmentTeamMember(user, selectedScheduleDepartment) : isDepartmentTeamMember(user, currentUser.department || "NOC")))
    .filter((user) => !query || user.name.includes(query) || user.role.includes(query) || user.email.includes(query));
}

function buildEmployeesExcel(list) {
  const isEnglishReport = currentLanguage === "en";
  const reportTitle = translatedText("רשימת עובדים");
  const exportDateLabel = isEnglishReport ? "Export date" : "ייצוא מתאריך";
  const activeEmployeesLabel = translatedText("סה\"כ עובדים פעילים");
  const emptyMessage = translatedText("לא נמצאו עובדים פעילים לייצוא.");
  const headers = [
    translatedText("שם"),
    translatedText("מספר עובד"),
    translatedText("תפקיד"),
    translatedText("מייל"),
    translatedText("טלפון"),
    translatedText("סטטוס"),
    translatedText("שעות חודשיות"),
  ].map((value) => xlsxCell(value, 1));
  const detailRows = list.length
    ? list.map((user, index) =>
        [
          user.name,
          user.employeeNumber || "-",
          translatedText(user.role),
          user.email,
          user.phone || "-",
          translatedText(user.employmentStatus || "משרה מלאה"),
          Number(getUserHours(user.email).toFixed(1)),
        ].map((value) => xlsxCell(value, index % 2 ? 14 : 0)),
      )
    : [[xlsxCell(emptyMessage, 10)]];
  return {
    rows: [
      [xlsxCell("FastShift", 3), "", "", "", "", "", xlsxCell(isEnglishReport ? "Employee Export" : "ייצוא עובדים", 3)],
      [xlsxCell(reportTitle, 11)],
      [xlsxCell(exportDateLabel, 12), xlsxCell(formatDate(new Date()), 13), "", xlsxCell(activeEmployeesLabel, 12), xlsxCell(list.length, 13)],
      [],
      headers,
      ...detailRows,
      [
        xlsxCell(isEnglishReport ? "General Summary" : "סיכום כללי", 9),
        xlsxCell("", 9),
        xlsxCell("", 9),
        xlsxCell("", 9),
        xlsxCell("", 9),
        xlsxCell(activeEmployeesLabel, 9),
        xlsxCell(list.length, 9),
      ],
    ],
    options: {
      widths: [22, 14, 18, 30, 18, 18, 16],
      rowHeights: { 0: 24, 1: 34, 2: 26, 4: 28 },
      merges: ["A1:F1", "A2:G2"],
    },
  };
}

function renderPermissions() {
  if (!can("manageUsers")) {
    document.querySelector("#permissionList").innerHTML = `<div class="list-item"><strong>${translatedText("אין הרשאה לניהול משתמשים והרשאות.")}</strong><span class="tag warning">${translatedText("מוגבל")}</span></div>`;
    return;
  }
  const rows = users
    .filter((user) => isSystemAdmin() || (user.department || "NOC") === (currentUser.department || "NOC"))
    .map(
      (user) => `
        <div class="list-item">
          <div>
            <strong>${user.name}</strong>
            <p>${user.email}</p>
            <small>${user.verificationSentAt ? `${translatedText("מייל אימות נשלח")}: ${formatDateTime(user.verificationSentAt)}` : ""}</small>
          </div>
          <div class="permission-actions">
            ${statusTag(user.status)}
            <select aria-label="הרשאה עבור ${user.name}" data-role-user="${user.id}">
              ${getRoleOptions(user.department || "NOC", user.role, isSystemAdmin())}
            </select>
            <button class="secondary-action" type="button" data-verify-user="${user.id}">${translatedText("אימות ידני")}</button>
            <button class="secondary-action danger-action" type="button" data-delete-user="${user.id}">${translatedText("מחיקה")}</button>
          </div>
        </div>
      `,
    )
    .join("");
  document.querySelector("#permissionList").innerHTML =
    rows || `<div class="list-item"><strong>${translatedText("אין משתמשים במערכת.")}</strong><span class="tag">0</span></div>`;
}

function renderAttendance() {
  if (manualAttendanceDate && !manualAttendanceDate.value) manualAttendanceDate.value = toDateInput(new Date());
  syncManualAttendanceTimes();
  if (!can("clearAttendance")) {
    attendanceDeleteMode = false;
    attendanceDeleteSelection = new Set();
  }
  document.querySelector("#clearAttendance").textContent = translatedText("ניקוי תיעוד");
  document.querySelector("#clearAttendance").classList.toggle("hidden", attendanceDeleteMode || !can("clearAttendance"));
  document.querySelector("#attendanceDeleteActions")?.classList.toggle("hidden", !attendanceDeleteMode || !can("clearAttendance"));
  const attendanceHeadRow = document.querySelector("#attendance thead tr");
  const deleteHeader = attendanceHeadRow?.querySelector("[data-attendance-delete-header]");
  if (attendanceDeleteMode && attendanceHeadRow && !deleteHeader) {
    attendanceHeadRow.insertAdjacentHTML("afterbegin", `<th data-attendance-delete-header>${translatedText("מחיקה")}</th>`);
  } else if (!attendanceDeleteMode && deleteHeader) {
    deleteHeader.remove();
  }
  const activeEntry = getOpenAttendance();
  attendanceState.textContent = activeEntry
    ? currentLanguage === "he"
      ? `משמרת פעילה מ-${formatDateTime(activeEntry.clockIn)}`
      : `Active shift since ${formatDateTime(activeEntry.clockIn)}`
    : translatedText("לא נמצאת משמרת פעילה");
  clockToggle.textContent = activeEntry ? translatedText("יציאה ממשמרת") : translatedText("כניסה למשמרת");
  clockToggle.classList.toggle("active", Boolean(activeEntry));
  const selectedUser = isManagerRole() ? users.find((user) => user.id === attendanceUser.value) : null;
  const visibleAttendance =
    isManagerRole()
      ? selectedUser
        ? attendanceLog.filter((entry) => entry.email === selectedUser.email)
        : attendanceLog
      : attendanceLog.filter((entry) => entry.email === currentUser.email);
  const rows = visibleAttendance
    .filter((entry) => !attendanceDeleteSelection.has(entry.id))
    .map(
      (entry) => `
        <tr>
          ${
            attendanceDeleteMode
              ? `<td data-label="${translatedText("מחיקה")}">
                  <button class="remove-assignment-button attendance-delete-button" type="button" data-toggle-attendance-delete="${entry.id}" aria-label="${translatedText("מחיקה")}">×</button>
                </td>`
              : ""
          }
          <td data-label="${translatedText("עובד/ת")}"><strong>${entry.employee}</strong></td>
          <td data-label="${translatedText("משמרת")}">${translatedText(entry.shiftLabel || "-")}</td>
          <td data-label="${translatedText("כניסה")}">${formatDateTime(entry.clockIn)}</td>
          <td data-label="${translatedText("יציאה")}">${formatDateTime(entry.clockOut)}</td>
          <td data-label="${translatedText("משך")}">${formatDuration(entry.clockIn, entry.clockOut)}</td>
          <td data-label="${translatedText("הוזן על ידי")}">${entry.enteredBy || "-"}</td>
        </tr>
      `,
    )
    .join("");
  document.querySelector("#attendanceRows").innerHTML =
    rows || `<tr><td colspan="${attendanceDeleteMode ? 7 : 6}">${translatedText("אין עדיין תיעוד כניסה או יציאה ממשמרת.")}</td></tr>`;
}

function renderReportData(data) {
  document.querySelector("#totalHoursMetric").textContent = data.metrics.totalHours.toFixed(1);
  document.querySelector("#totalShiftsMetric").textContent = String(data.metrics.totalShifts);
  const entries = getVisibleReportEntries(data);
  const rows = entries
    .map(
      (entry) => `
        <tr>
          <td data-label="${translatedText("עובד/ת")}"><strong>${entry.employee}</strong></td>
          <td data-label="${translatedText("מספר עובד")}">${getRecordEmployeeNumber(entry)}</td>
          <td data-label="${translatedText("תאריך")}">${formatDate(entry.clockIn)}</td>
          <td data-label="${translatedText("משמרת")}">${translatedText(entry.shiftLabel || "-")}</td>
          <td data-label="${translatedText("כניסה")}">${formatDateTime(entry.clockIn)}</td>
          <td data-label="${translatedText("יציאה")}">${formatDateTime(entry.clockOut)}</td>
          <td data-label="${translatedText("שעות")}">${entry.clockOut ? getDurationHours(entry.clockIn, entry.clockOut).toFixed(1) : "-"}</td>
          <td data-label="${translatedText("סטטוס")}">${translatedText(getRecordEmploymentStatus(entry))}</td>
        </tr>
      `,
    )
    .join("");
  document.querySelector("#reportRows").innerHTML =
    rows || `<tr><td colspan="8">${translatedText("לא נמצאו משמרות בטווח התאריכים שנבחר.")}</td></tr>`;
}

function getVisibleReportEntries(data) {
  return isManagerRole() ? data.entries : data.entries.filter((entry) => entry.email === currentUser.email);
}

function getReportSelection() {
  const selectedUserId = isManagerRole() ? reportUser.value : "";
  const selectedUser = users.find((user) => user.id === selectedUserId);
  const departmentQuery = isSystemAdmin() ? `&department=${encodeURIComponent(selectedScheduleDepartment)}` : "";
  const employeeQuery = selectedUserId ? `&userId=${encodeURIComponent(selectedUserId)}${departmentQuery}` : departmentQuery;
  return { selectedUserId, selectedUser, employeeQuery };
}

async function fetchReportData() {
  if (!can("reports")) throw new Error("אין הרשאה להפקת דוחות.");
  if (!reportFrom.value || !reportTo.value) throw new Error("יש לבחור טווח תאריכים.");
  const { selectedUser, employeeQuery } = getReportSelection();
  const data = await request(`/api/reports?from=${encodeURIComponent(reportFrom.value)}&to=${encodeURIComponent(reportTo.value)}${employeeQuery}`);
  return { data, selectedUser };
}

function markReportsDirty() {
  reportRenderId += 1;
  if (!isViewActive("reports")) return;
  setActionOutput(
    reportNotice,
    currentLanguage === "he"
      ? "הבחירה עודכנה. לחץ/י על הצגת משמרות, הפקת דוח שעות או חישוב שכר כדי להריץ דוח."
      : "Selection updated. Click Show Shifts, Generate Hours Report, or Payroll Calculation to run a report.",
  );
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeXml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function safeFilePart(value) {
  return String(value || "all")
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-");
}

function excelColumnName(index) {
  let column = "";
  let value = index + 1;
  while (value > 0) {
    const remainder = (value - 1) % 26;
    column = String.fromCharCode(65 + remainder) + column;
    value = Math.floor((value - 1) / 26);
  }
  return column;
}

function crc32(bytes) {
  let crc = -1;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ -1) >>> 0;
}

function uint16(value) {
  const bytes = new Uint8Array(2);
  new DataView(bytes.buffer).setUint16(0, value, true);
  return bytes;
}

function uint32(value) {
  const bytes = new Uint8Array(4);
  new DataView(bytes.buffer).setUint32(0, value >>> 0, true);
  return bytes;
}

function bytesFromString(value) {
  return new TextEncoder().encode(value);
}

function concatBytes(parts) {
  const size = parts.reduce((sum, part) => sum + part.length, 0);
  const output = new Uint8Array(size);
  let offset = 0;
  parts.forEach((part) => {
    output.set(part, offset);
    offset += part.length;
  });
  return output;
}

function dosDateTime(date = new Date()) {
  const time = ((date.getHours() & 0x1f) << 11) | ((date.getMinutes() & 0x3f) << 5) | Math.floor(date.getSeconds() / 2);
  const day = Math.max(1, date.getDate());
  const month = date.getMonth() + 1;
  const year = Math.max(1980, date.getFullYear()) - 1980;
  return { date: (year << 9) | (month << 5) | day, time };
}

function createZip(files) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  const { date, time } = dosDateTime();

  files.forEach((file) => {
    const name = bytesFromString(file.name);
    const data = file.data instanceof Uint8Array ? file.data : bytesFromString(file.data);
    const checksum = crc32(data);
    const localHeader = concatBytes([
      uint32(0x04034b50),
      uint16(20),
      uint16(0x0800),
      uint16(0),
      uint16(time),
      uint16(date),
      uint32(checksum),
      uint32(data.length),
      uint32(data.length),
      uint16(name.length),
      uint16(0),
      name,
    ]);
    localParts.push(localHeader, data);
    centralParts.push(
      concatBytes([
        uint32(0x02014b50),
        uint16(20),
        uint16(20),
        uint16(0x0800),
        uint16(0),
        uint16(time),
        uint16(date),
        uint32(checksum),
        uint32(data.length),
        uint32(data.length),
        uint16(name.length),
        uint16(0),
        uint16(0),
        uint16(0),
        uint16(0),
        uint32(0),
        uint32(offset),
        name,
      ]),
    );
    offset += localHeader.length + data.length;
  });

  const centralDirectory = concatBytes(centralParts);
  const endRecord = concatBytes([
    uint32(0x06054b50),
    uint16(0),
    uint16(0),
    uint16(files.length),
    uint16(files.length),
    uint32(centralDirectory.length),
    uint32(offset),
    uint16(0),
  ]);
  return concatBytes([...localParts, centralDirectory, endRecord]);
}

function normalizeXlsxCell(cell) {
  if (cell && typeof cell === "object" && !Array.isArray(cell)) return cell;
  return { value: cell };
}

function xlsxCell(value, style = 0) {
  return { value, style };
}

function cellXml(cell, rowIndex, columnIndex, fallbackStyle = 0) {
  const normalized = normalizeXlsxCell(cell);
  const value = normalized.value;
  const style = normalized.style ?? fallbackStyle;
  const ref = `${excelColumnName(columnIndex)}${rowIndex}`;
  if (typeof value === "number" && Number.isFinite(value)) {
    return `<c r="${ref}" s="${style}"><v>${value}</v></c>`;
  }
  return `<c r="${ref}" s="${style}" t="inlineStr"><is><t>${escapeXml(value)}</t></is></c>`;
}

function worksheetXml(rows, direction = currentLanguage === "en" ? "ltr" : "rtl", options = {}) {
  const maxColumns = Math.max(1, ...rows.map((row) => row.length));
  const sheetRows = rows
    .map((row, rowIndex) => {
      const excelRowIndex = rowIndex + 1;
      const cells = row
        .map((value, columnIndex) => {
          const style = rowIndex === 0 ? 1 : rowIndex <= 4 ? 2 : 0;
          return cellXml(value, excelRowIndex, columnIndex, style);
        })
        .join("");
      const height = options.rowHeights?.[rowIndex];
      return `<row r="${excelRowIndex}"${height ? ` ht="${height}" customHeight="1"` : ""}>${cells}</row>`;
    })
    .join("");
  const widths = options.widths || [];
  const columns = Array.from(
    { length: maxColumns },
    (_, index) => `<col min="${index + 1}" max="${index + 1}" width="${widths[index] || 18}" customWidth="1"/>`,
  ).join("");
  const merges = options.merges?.length
    ? `<mergeCells count="${options.merges.length}">${options.merges.map((ref) => `<mergeCell ref="${ref}"/>`).join("")}</mergeCells>`
    : "";
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetViews><sheetView workbookViewId="0" rightToLeft="${direction === "rtl" ? "1" : "0"}"/></sheetViews>
  <cols>${columns}</cols>
  <sheetData>${sheetRows}</sheetData>
  ${merges}
</worksheet>`;
}

function buildXlsx(rows, sheetName = "FastShift", options = {}) {
  const direction = currentLanguage === "en" ? "ltr" : "rtl";
  const files = [
    {
      name: "[Content_Types].xml",
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`,
    },
    {
      name: "_rels/.rels",
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`,
    },
    {
      name: "xl/_rels/workbook.xml.rels",
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`,
    },
    {
      name: "xl/workbook.xml",
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="${escapeXml(sheetName).slice(0, 31)}" sheetId="1" r:id="rId1"/></sheets>
</workbook>`,
    },
    {
      name: "xl/styles.xml",
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="5"><font><sz val="11"/><name val="Arial"/></font><font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="Arial"/></font><font><b/><sz val="11"/><name val="Arial"/></font><font><b/><sz val="14"/><name val="Arial"/></font><font><b/><color rgb="FF126C65"/><sz val="11"/><name val="Arial"/></font></fonts>
  <fills count="12"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF126C65"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FF17365D"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFDDEBF7"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFE2F0D9"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFFF2CC"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFCE4D6"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFC6E0B4"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFFC7CE"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFEAF4F2"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF8FAFC"/><bgColor indexed="64"/></patternFill></fill></fills>
  <borders count="2"><border/><border><left style="thin"/><right style="thin"/><top style="thin"/><bottom style="thin"/></border></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="16"><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1"><alignment vertical="center"/></xf><xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="2" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1"><alignment vertical="center"/></xf><xf numFmtId="0" fontId="1" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="2" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="4" borderId="1" xfId="0" applyFill="1" applyBorder="1"><alignment vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="5" borderId="1" xfId="0" applyFill="1" applyBorder="1"><alignment vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="6" borderId="1" xfId="0" applyFill="1" applyBorder="1"><alignment vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="7" borderId="1" xfId="0" applyFill="1" applyBorder="1"><alignment vertical="center"/></xf><xf numFmtId="0" fontId="2" fillId="8" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment vertical="center"/></xf><xf numFmtId="0" fontId="2" fillId="9" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment vertical="center"/></xf><xf numFmtId="0" fontId="3" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="4" fillId="10" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment vertical="center"/></xf><xf numFmtId="0" fontId="2" fillId="11" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="11" borderId="1" xfId="0" applyFill="1" applyBorder="1"><alignment vertical="center"/></xf><xf numFmtId="0" fontId="2" fillId="5" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf></cellXfs>
  <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`,
    },
    {
      name: "xl/worksheets/sheet1.xml",
      data: worksheetXml(rows, direction, options),
    },
  ];
  return createZip(files);
}

function isViewActive(viewId) {
  return document.querySelector(`#${viewId}`)?.classList.contains("active");
}

function buildHoursReportExcel(data, selectedUser) {
  const entries = getVisibleReportEntries(data);
  const isEnglishReport = currentLanguage === "en";
  const employeeLabel = isManagerRole() ? selectedUser?.name || translatedText("כל העובדים") : currentUser.name;
  const reportRange = `${formatDate(reportFrom.value)}-${formatDate(reportTo.value)}`;
  const header = [
    translatedText("עובד/ת"),
    translatedText("מספר עובד"),
    translatedText("תאריך"),
    translatedText("משמרת"),
    translatedText("כניסה"),
    translatedText("יציאה"),
    translatedText("שעות"),
    translatedText("סטטוס"),
  ].map((value) => xlsxCell(value, 1));
  const detailRows = entries.length
    ? entries.map((entry) => {
        const date = new Date(entry.clockIn);
        const rowStyle = date.getDay() === 5 ? 7 : date.getDay() === 6 ? 8 : 0;
        return [
          entry.employee,
          getRecordEmployeeNumber(entry),
          formatDate(entry.clockIn),
          translatedText(entry.shiftLabel || "-"),
          formatDateTime(entry.clockIn),
          formatDateTime(entry.clockOut),
          entry.clockOut ? Number(getDurationHours(entry.clockIn, entry.clockOut).toFixed(1)) : "-",
      translatedText(getRecordEmploymentStatus(entry)),
        ].map((value) => xlsxCell(value, rowStyle));
      })
    : [[xlsxCell(translatedText("לא נמצאו משמרות בטווח התאריכים שנבחר."), 10)]];
  return {
    rows: [
      [xlsxCell("FastShift", 3), "", "", "", "", "", "", xlsxCell(isEnglishReport ? "Hours Report" : "דוח שעות", 3)],
      [xlsxCell(translatedText("דוח שעות"), 11)],
      [
        xlsxCell(translatedText("עובד/ת"), 12),
        xlsxCell(employeeLabel, 13),
        xlsxCell(isEnglishReport ? "Date Range" : "טווח תאריכים", 12),
        xlsxCell(reportRange, 13),
        xlsxCell(translatedText("סה\"כ שעות"), 12),
        xlsxCell(Number(data.metrics.totalHours.toFixed(1)), 13),
        xlsxCell(translatedText("משמרות"), 12),
        xlsxCell(data.metrics.totalShifts, 13),
      ],
      header,
      ...detailRows,
      [
        xlsxCell(currentLanguage === "en" ? "General Summary" : "סיכום כללי", 9),
        xlsxCell("", 9),
        xlsxCell("", 9),
        xlsxCell("", 9),
        xlsxCell("", 9),
        xlsxCell("", 9),
        xlsxCell(Number(data.metrics.totalHours.toFixed(1)), 9),
        xlsxCell(data.metrics.totalShifts, 9),
      ],
    ],
    options: {
      widths: [24, 14, 14, 13, 24, 24, 12, 18],
      rowHeights: { 0: 24, 1: 34, 2: 26, 3: 28 },
      merges: ["A1:G1", "A2:H2"],
    },
  };
}

const PAYROLL_CONFIG = {
  monthlyHours: 182,
  socShiftLeadMonthlySalary: 18500,
  tier2MonthlySalary: 18500,
  tier1HourlyRate: 50,
  nocFullTimeMonthlySalary: 13000,
  nocShiftLeadHourlyRate: 45,
  nocPartTimeHourlyRate: 45,
  stepHours: 0.25,
};

function payrollRoleLabel(user) {
  const department = user.department || "NOC";
  if (user.role === "אחראי/ת משמרת") return department === "SOC" ? "אחראי משמרת SOC" : "אחראי משמרת NOC";
  return user.role;
}

function buildPayrollRate({ mode, roleLabel, hourlyRate = 0, fixedBase = 0, undefinedSalary = false }) {
  const isEnglish = currentLanguage === "en";
  const employmentType =
    mode === "hourly"
      ? isEnglish
        ? "Hourly"
        : "שעתי"
      : undefinedSalary
        ? isEnglish
          ? "Global, salary not defined"
          : "גלובלי, שכר לא מוגדר"
        : isEnglish
          ? "Global"
          : "גלובלי";
  return {
    mode,
    label: `${translatedText(roleLabel)} - ${employmentType}`,
    hourlyRate,
    fixedBase,
    undefinedSalary,
  };
}

function getPayrollUser() {
  if (isManagerRole()) {
    if (!reportUser.value) throw new Error('חישוב שכר מתבצע לעובד/ת אחד/ת בלבד. יש לבחור עובד/ת ולא "כל העובדים".');
    const selectedUser = users.find((user) => user.id === reportUser.value);
    if (!selectedUser) throw new Error("העובד/ת שנבחר/ה לא נמצא/ה במערכת.");
    return selectedUser;
  }
  return currentUser;
}

function getPayrollRate(user) {
  const department = user.department || "NOC";
  const roleLabel = payrollRoleLabel(user);
  if (user.role === "מנהל SOC" || user.role === "מנהל NOC" || user.role === systemAdminRole || user.role === "מנהל/ת") {
    return buildPayrollRate({ mode: "global", roleLabel, fixedBase: null, undefinedSalary: true });
  }
  if (user.role === "אחראי/ת משמרת" && department === "SOC") {
    return buildPayrollRate({
      mode: "global",
      roleLabel,
      hourlyRate: PAYROLL_CONFIG.socShiftLeadMonthlySalary / PAYROLL_CONFIG.monthlyHours,
      fixedBase: PAYROLL_CONFIG.socShiftLeadMonthlySalary,
    });
  }
  if (user.role === "Tier 2") {
    return buildPayrollRate({
      mode: "global",
      roleLabel,
      hourlyRate: PAYROLL_CONFIG.tier2MonthlySalary / PAYROLL_CONFIG.monthlyHours,
      fixedBase: PAYROLL_CONFIG.tier2MonthlySalary,
    });
  }
  if (user.role === "Tier 1") {
    return buildPayrollRate({ mode: "hourly", roleLabel, hourlyRate: PAYROLL_CONFIG.tier1HourlyRate });
  }
  if (user.role === "אחראי/ת משמרת" && department === "NOC") {
    return buildPayrollRate({ mode: "hourly", roleLabel, hourlyRate: PAYROLL_CONFIG.nocShiftLeadHourlyRate });
  }
  if (user.role === "NOC - משרה מלאה") {
    return buildPayrollRate({
      mode: "global",
      roleLabel,
      hourlyRate: PAYROLL_CONFIG.nocFullTimeMonthlySalary / PAYROLL_CONFIG.monthlyHours,
      fixedBase: PAYROLL_CONFIG.nocFullTimeMonthlySalary,
    });
  }
  if (user.role === "NOC - משרה חלקית") {
    return buildPayrollRate({ mode: "hourly", roleLabel, hourlyRate: PAYROLL_CONFIG.nocPartTimeHourlyRate });
  }
  throw new Error("חישוב שכר זמין רק עבור תפקידי SOC/NOC מוגדרים.");
}

function getDatesTouched(startValue, endValue) {
  const start = parseDateOnly(startValue);
  const end = parseDateOnly(endValue || startValue);
  const dates = [];
  for (let cursor = start; cursor <= end; cursor = addDays(cursor, 1)) {
    dates.push(toDateInput(cursor));
  }
  return dates;
}

function getEntryHolidays(entry) {
  return getHolidayPayWindows(entry.clockIn, entry.clockOut).map((window) => window.holiday);
}

function isHolidayEve(holiday) {
  return /^ערב\b/i.test(holiday.title || "") || /^Erev\b/i.test(holiday.title || "");
}

function getHolidayPayWindows(clockIn, clockOut) {
  const start = new Date(clockIn);
  const end = clockOut ? new Date(clockOut) : start;
  const firstDate = addDays(start, -1);
  const lastDate = addDays(end, 1);
  const windows = [];
  const seen = new Set();

  for (let cursor = firstDate; cursor <= lastDate; cursor = addDays(cursor, 1)) {
    getHolidayForDate(cursor)
      .filter((holiday) => !isHolidayEve(holiday))
      .forEach((holiday) => {
        const key = `${holiday.date}-${holiday.title}`;
        if (seen.has(key)) return;
        seen.add(key);
        const holidayDate = parseDateOnly(holiday.date);
        const windowStart = addDays(holidayDate, -1);
        windowStart.setHours(23, 0, 0, 0);
        const windowEnd = parseDateOnly(holidayDate);
        windowEnd.setHours(19, 0, 0, 0);
        if (start < windowEnd && end > windowStart) windows.push({ holiday, start: windowStart, end: windowEnd });
      });
  }

  return windows;
}

function overlapsAnyWindow(start, end, windows) {
  return windows.some((window) => start < window.end && end > window.start);
}

function overlapsNightShift(clockIn, clockOut) {
  const start = new Date(clockIn);
  const end = new Date(clockOut);
  const firstNight = parseDateOnly(start);
  firstNight.setDate(firstNight.getDate() - 1);
  const lastNight = parseDateOnly(end);

  for (let day = firstNight; day <= lastNight; day = addDays(day, 1)) {
    const nightStart = new Date(day);
    nightStart.setHours(23, 0, 0, 0);
    const nightEnd = addDays(day, 1);
    nightEnd.setHours(7, 0, 0, 0);
    if (start < nightEnd && end > nightStart) return true;
  }
  return false;
}

function formatMoney(value) {
  return new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 2 }).format(value);
}

function formatPayrollMoney(value) {
  if (value === null || Number.isNaN(Number(value))) return currentLanguage === "en" ? "Not defined" : "לא מוגדר";
  return formatMoney(value);
}

function calculateEntryPayroll(entry, payrollRate) {
  const totalHours = getDurationHours(entry.clockIn, entry.clockOut);
  const holidayWindows = getHolidayPayWindows(entry.clockIn, entry.clockOut);
  const holidays = holidayWindows.map((window) => window.holiday);
  const isNight = overlapsNightShift(entry.clockIn, entry.clockOut);
  const canCalculatePremiums = payrollRate.mode === "hourly" && !payrollRate.undefinedSalary;
  const nightPremiumStart = isNight ? Math.min(7, totalHours) : totalHours;
  let weightedPay = 0;
  let basePay = 0;
  let regularHours = 0;
  let overtimeHours = 0;
  let holidayHours = 0;
  let nightHours = 0;
  let nightLastHour = 0;
  let elapsed = 0;

  while (elapsed < totalHours) {
    const step = Math.min(PAYROLL_CONFIG.stepHours, totalHours - elapsed);
    const stepStart = new Date(new Date(entry.clockIn).getTime() + elapsed * 60 * 60 * 1000);
    const stepEnd = new Date(stepStart.getTime() + step * 60 * 60 * 1000);
    const isHolidayStep = canCalculatePremiums && overlapsAnyWindow(stepStart, stepEnd, holidayWindows);
    let multiplier = 1;
    if (isHolidayStep) {
      multiplier = 1.5;
    } else {
      if (canCalculatePremiums && elapsed >= 8) multiplier = Math.max(multiplier, 1.25);
      if (canCalculatePremiums && isNight) multiplier = Math.max(multiplier, elapsed >= nightPremiumStart ? 1.625 : 1.3);
    }
    weightedPay += payrollRate.hourlyRate * step * multiplier;
    basePay += payrollRate.hourlyRate * step;
    if (canCalculatePremiums) {
      if (multiplier >= 1.625) nightLastHour += step;
      else if (multiplier >= 1.5) holidayHours += step;
      else if (multiplier >= 1.3) nightHours += step;
      else if (multiplier >= 1.25) overtimeHours += step;
      else regularHours += step;
    } else {
      regularHours += step;
    }
    elapsed += step;
  }

  return {
    employee: entry.employee,
    shiftLabel: entry.shiftLabel || "",
    clockInRaw: entry.clockIn,
    clockOutRaw: entry.clockOut,
    dayName: formatDayName(entry.clockIn),
    date: formatDate(entry.clockIn),
    clockIn: formatDateTime(entry.clockIn),
    clockOut: formatDateTime(entry.clockOut),
    totalHours,
    regularHours,
    overtimeHours,
    holidayHours,
    holidayNames: [...new Set(holidays.map((holiday) => translatedText(holiday.title)))].join(", "),
    nightHours,
    nightLastHour,
    basePay,
    premiumPay: Math.max(0, weightedPay - basePay),
    weightedPay,
  };
}

function calculatePayroll(data, payrollUser) {
  const payrollRate = getPayrollRate(payrollUser);
  const completedEntries = getVisibleReportEntries(data).filter((entry) => entry.clockOut);
  const rows = completedEntries.map((entry) => calculateEntryPayroll(entry, payrollRate));
  const totals = rows.reduce(
    (sum, row) => ({
      totalHours: sum.totalHours + row.totalHours,
      regularHours: sum.regularHours + row.regularHours,
      overtimeHours: sum.overtimeHours + row.overtimeHours,
      holidayHours: sum.holidayHours + row.holidayHours,
      nightHours: sum.nightHours + row.nightHours,
      nightLastHour: sum.nightLastHour + row.nightLastHour,
      basePay: sum.basePay + row.basePay,
      premiumPay: sum.premiumPay + row.premiumPay,
      weightedPay: sum.weightedPay + row.weightedPay,
    }),
    {
      totalHours: 0,
      regularHours: 0,
      overtimeHours: 0,
      holidayHours: 0,
      nightHours: 0,
      nightLastHour: 0,
      basePay: 0,
      premiumPay: 0,
      weightedPay: 0,
    },
  );
  const grossPay = payrollRate.undefinedSalary ? null : payrollRate.mode === "global" ? payrollRate.fixedBase : totals.weightedPay;
  return { payrollRate, rows, totals, grossPay };
}

function buildPayrollExcel(data, payrollUser) {
  const payroll = calculatePayroll(data, payrollUser);
  const workingDays = new Set(payroll.rows.map((row) => row.date)).size;
  const isEnglishReport = currentLanguage === "en";
  const reportLocale = isEnglishReport ? "en-US" : "he-IL";
  const reportText = isEnglishReport
    ? {
        dir: "ltr",
        lang: "en",
        issueDate: "Issue date",
        title: "Detailed payroll report",
        employeeName: "Employee name",
        employeeNumber: "Employee number",
        betweenDates: "Between dates",
        to: "to",
        workingDays: "Working days",
        shifts: "Shifts",
        employmentContract: "Employment contract",
        hourlyValue: "Hourly value",
        day: "Day",
        date: "Date",
        role: "Role",
        entrance: "Entrance",
        exit: "Exit",
        notes: "Notes",
        regular: "Regular",
        night130: "130%",
        holiday: "Holiday",
        summary: "Summary",
        generalSummary: "General summary",
        totalPay: "Total payable",
        empty: "No completed shifts were found in the selected date range.",
        globalPay: "Payable bonus",
        shiftPay: "Shift pay",
      }
    : {
        dir: "rtl",
        lang: "he",
        issueDate: "תאריך הפקה",
        title: "דוח שכר מפורט",
        employeeName: "שם עובד/ת",
        employeeNumber: "מספר עובד",
        betweenDates: "בין תאריכים",
        to: "עד",
        workingDays: "ימי עבודה",
        shifts: "משמרות",
        employmentContract: "שיטת העסקה",
        hourlyValue: "ערך שעה",
        day: "יום",
        date: "תאריך",
        role: "תפקיד",
        entrance: "כניסה",
        exit: "יציאה",
        notes: "הערות",
        regular: "רגיל",
        night130: "130%",
        holiday: "חג",
        summary: "סיכום",
        generalSummary: "סיכום כללי",
        totalPay: 'סה"כ לתשלום',
        empty: "לא נמצאו משמרות שהושלמו בטווח התאריכים שנבחר.",
        globalPay: "תוספת לתשלום",
        shiftPay: "שכר משמרת",
      };
  const payrollAmountLabel = payroll.payrollRate.mode === "global" ? reportText.globalPay : reportText.shiftPay;
  const payrollRateLabel = payroll.payrollRate.label;
  const formatReportDate = (value) => new Intl.DateTimeFormat(reportLocale, { dateStyle: "short" }).format(parseDateOnly(value));
  const formatReportDateTime = (value) =>
    value ? new Intl.DateTimeFormat(reportLocale, { dateStyle: "short", timeStyle: "short" }).format(new Date(value)) : "-";
  const formatReportDay = (value) => new Intl.DateTimeFormat(reportLocale, { weekday: "short" }).format(new Date(value));
  const formatReportRole = (role) =>
    isEnglishReport
      ? {
          "מנהל/ת": "Admin",
          "אחראי/ת משמרת": "Shift Lead",
          "עובד/ת": "Tier 1",
        }[role] || role
      : role;
  const formatReportShift = (shiftLabel) =>
    isEnglishReport
      ? {
          "בוקר": "Morning",
          "ערב": "Evening",
          "לילה": "Night",
        }[shiftLabel] || shiftLabel
      : shiftLabel;
  const rows = payroll.rows.length
    ? payroll.rows
        .map(
          (row) => `
            <tr>
              <td>${escapeHtml(isEnglishReport ? formatReportDay(row.clockInRaw) : row.dayName)}</td>
              <td>${escapeHtml(isEnglishReport ? formatReportDate(row.clockInRaw) : row.date)}</td>
              <td>${escapeHtml(formatReportRole(payrollUser.role))}</td>
              <td class="time-cell">${escapeHtml(isEnglishReport ? formatReportDateTime(row.clockInRaw) : row.clockIn)}</td>
              <td class="time-cell">${escapeHtml(isEnglishReport ? formatReportDateTime(row.clockOutRaw) : row.clockOut)}</td>
              <td>${escapeHtml([formatReportShift(row.shiftLabel), row.holidayNames].filter(Boolean).join(" · "))}</td>
              <td class="number">${escapeHtml(row.regularHours.toFixed(2))}</td>
              <td class="number">${escapeHtml(row.overtimeHours.toFixed(2))}</td>
              <td class="number">${escapeHtml(row.nightHours.toFixed(2))}</td>
              <td class="number">${escapeHtml(row.holidayHours.toFixed(2))}</td>
              <td class="number">${escapeHtml(row.nightLastHour.toFixed(2))}</td>
              <td class="number"></td>
              <td class="number"></td>
              <td class="number">${escapeHtml(row.totalHours.toFixed(2))}</td>
              <td class="money">${escapeHtml(formatPayrollMoney(payroll.payrollRate.undefinedSalary ? null : payroll.payrollRate.mode === "global" ? 0 : row.premiumPay))}</td>
              <td class="money">${escapeHtml(formatPayrollMoney(payroll.payrollRate.undefinedSalary ? null : payroll.payrollRate.mode === "global" ? 0 : row.weightedPay))}</td>
            </tr>
          `,
        )
        .join("")
    : `<tr><td class="empty-state" colspan="16">${escapeHtml(reportText.empty)}</td></tr>`;

  return `
    <html dir="${reportText.dir}" lang="${reportText.lang}">
      <head>
        <meta charset="utf-8" />
        <style>
          body {
            margin: 0;
            padding: 18px;
            direction: ${reportText.dir};
            font-family: Arial, sans-serif;
            color: #0b1f33;
            background: #ffffff;
          }
          .sheet {
            width: 100%;
            background: #ffffff;
          }
          .brand-row td {
            border: 0;
            background: #12306c;
            color: #ffffff;
            font-size: 22px;
            font-weight: 900;
          }
          .brand-row .issued {
            text-align: ${isEnglishReport ? "right" : "left"};
            font-size: 12px;
            font-weight: 700;
          }
          .report-title td {
            border: 0;
            background: #d9edf7;
            color: #12306c;
            font-weight: 800;
          }
          .report-title .title {
            font-size: 22px;
          }
          .note {
            color: #4f6478;
            font-size: 12px;
            font-weight: 700;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 0;
            background: #ffffff;
          }
          th,
          td {
            border: 1px solid #9fb3c4;
            padding: 6px 7px;
            text-align: center;
            vertical-align: middle;
          }
          th {
            background: #d9d9d9;
            color: #0b1f33;
            font-weight: 800;
            white-space: nowrap;
          }
          .main-head th {
            background: #0f766e;
            color: #ffffff;
          }
          .meta-table td {
            border-color: #c9d6df;
            background: #d9edf7;
            text-align: ${isEnglishReport ? "left" : "right"};
          }
          .meta-label {
            color: #60758a;
            font-weight: 800;
          }
          .meta-value {
            color: #0b1f33;
            font-weight: 800;
          }
          .summary-row td {
            background: #cfe8f3;
            font-weight: 900;
          }
          .pay-row td {
            background: #eef6e8;
            color: #075f59;
            font-weight: 900;
          }
          .details-table tr:nth-child(even) td {
            background: #fff9df;
          }
          .details-table tr:nth-child(odd) td {
            background: #ffffff;
          }
          .details-table td {
            white-space: nowrap;
          }
          .time-cell {
            background: #e7f2f8 !important;
          }
          .number {
            text-align: center;
            font-weight: 800;
          }
          .money {
            color: #075f59;
            font-weight: 800;
          }
          .empty-state {
            padding: 22px;
            text-align: center;
            color: #60758a;
            font-weight: 700;
            background: #f8fbfd;
          }
        </style>
      </head>
      <body>
        <div class="sheet">
          <table class="meta-table">
            <tr class="brand-row">
              <td colspan="10">FastShift</td>
              <td class="issued" colspan="6">${reportText.issueDate}: ${escapeHtml(formatReportDateTime(new Date()))}</td>
            </tr>
            <tr class="report-title">
              <td class="title" colspan="16">${escapeHtml(reportText.title)}</td>
            </tr>
            <tr>
              <td colspan="3"><span class="meta-label">${escapeHtml(reportText.employeeName)}:</span> <span class="meta-value">${escapeHtml(payrollUser.name)}</span></td>
              <td colspan="3"><span class="meta-label">${escapeHtml(reportText.employeeNumber)}:</span> <span class="meta-value">${escapeHtml(payrollUser.employeeNumber || "-")}</span></td>
              <td colspan="4"><span class="meta-label">${escapeHtml(reportText.betweenDates)}:</span> <span class="meta-value">${escapeHtml(formatReportDate(reportFrom.value))} ${escapeHtml(reportText.to)} ${escapeHtml(formatReportDate(reportTo.value))}</span></td>
              <td colspan="3"><span class="meta-label">${escapeHtml(reportText.workingDays)}:</span> <span class="meta-value">${escapeHtml(workingDays)}</span></td>
              <td colspan="4"><span class="meta-label">${escapeHtml(reportText.shifts)}:</span> <span class="meta-value">${escapeHtml(payroll.rows.length)}</span></td>
            </tr>
            <tr>
              <td colspan="6"><span class="meta-label">${escapeHtml(reportText.employmentContract)}:</span> <span class="meta-value">${escapeHtml(payrollRateLabel)}</span></td>
              <td colspan="6"><span class="meta-label">${escapeHtml(reportText.hourlyValue)}:</span> <span class="meta-value">${escapeHtml(formatPayrollMoney(payroll.payrollRate.undefinedSalary ? null : payroll.payrollRate.hourlyRate))}</span></td>
              <td colspan="4"></td>
            </tr>
          </table>

          <table class="details-table">
          <colgroup>
            <col style="width: 70px" />
            <col style="width: 95px" />
            <col style="width: 80px" />
            <col style="width: 135px" />
            <col style="width: 135px" />
            <col style="width: 150px" />
            <col style="width: 70px" />
            <col style="width: 70px" />
            <col style="width: 70px" />
            <col style="width: 82px" />
            <col style="width: 82px" />
            <col style="width: 82px" />
            <col style="width: 82px" />
            <col style="width: 82px" />
            <col style="width: 95px" />
            <col style="width: 115px" />
          </colgroup>
          <thead>
            <tr class="main-head">
              <th>${escapeHtml(reportText.day)}</th>
              <th>${escapeHtml(reportText.date)}</th>
              <th>${escapeHtml(reportText.role)}</th>
              <th>${escapeHtml(reportText.entrance)}</th>
              <th>${escapeHtml(reportText.exit)}</th>
              <th>${escapeHtml(reportText.notes)}</th>
              <th>${escapeHtml(reportText.regular)}</th>
              <th>125%</th>
              <th>${escapeHtml(reportText.night130)}</th>
              <th>150%</th>
              <th>162.5%</th>
              <th>${escapeHtml(reportText.holiday)}</th>
              <th>175%</th>
              <th>200%</th>
              <th>${escapeHtml(reportText.summary)}</th>
              <th>${escapeHtml(payrollAmountLabel)}</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
            <tr class="summary-row">
              <td colspan="6">${escapeHtml(reportText.generalSummary)}</td>
              <td>${escapeHtml(payroll.totals.regularHours.toFixed(2))}</td>
              <td>${escapeHtml(payroll.totals.overtimeHours.toFixed(2))}</td>
              <td>${escapeHtml(payroll.totals.nightHours.toFixed(2))}</td>
              <td>${escapeHtml(payroll.totals.holidayHours.toFixed(2))}</td>
              <td>${escapeHtml(payroll.totals.nightLastHour.toFixed(2))}</td>
              <td></td>
              <td></td>
              <td></td>
              <td>${escapeHtml(payroll.totals.totalHours.toFixed(2))}</td>
              <td class="money">${escapeHtml(formatPayrollMoney(payroll.grossPay))}</td>
            </tr>
          </tbody>
        </table>
        </div>
      </body>
    </html>
  `;
}

function buildPayrollWorkbookRows(data, payrollUser) {
  const payroll = calculatePayroll(data, payrollUser);
  const workingDays = new Set(payroll.rows.map((row) => row.date)).size;
  const isEnglishReport = currentLanguage === "en";
  const text = isEnglishReport
    ? {
        title: "Detailed Payroll Report",
        employeeName: "Employee Name",
        employeeNumber: "Employee Number",
        betweenDates: "Between Dates",
        to: "to",
        workingDays: "Working Days",
        shifts: "Shifts",
        employmentContract: "Employment Contract",
        hourlyValue: "Hourly Value",
        issueDate: "Issue Date",
        totalHours: "Total Hours",
        day: "Day",
        date: "Date",
        role: "Role",
        entrance: "Entrance",
        exit: "Exit",
        notes: "Notes",
        regular: "Regular",
        night130: "130%",
        holiday: "Holiday",
        summary: "Summary",
        totalPay: "Total Pay",
      }
    : {
        title: "דוח שכר מפורט",
        employeeName: "שם עובד",
        employeeNumber: "מספר עובד",
        betweenDates: "בין תאריכים",
        to: "עד",
        workingDays: "ימי עבודה",
        shifts: "משמרות",
        employmentContract: "חוזה העסקה",
        hourlyValue: "ערך שעה",
        issueDate: "תאריך הפקה",
        totalHours: 'סה"כ שעות',
        day: "יום",
        date: "תאריך",
        role: "תפקיד",
        entrance: "כניסה",
        exit: "יציאה",
        notes: "הערות",
        regular: "רגילות",
        night130: "130%",
        holiday: "חג",
        summary: "סה\"כ",
        totalPay: "סה\"כ לתשלום",
      };
  const payrollAmountLabel = payroll.payrollRate.mode === "global" ? (isEnglishReport ? "Additional Shift Pay" : "תוספת") : isEnglishReport ? "Shift Pay" : "שכר משמרת";
  const columns = 16;
  const reportRange = `${formatDate(reportFrom.value)} ${text.to} ${formatDate(reportTo.value)}`;
  const padRow = (cells, style = 0) =>
    Array.from({ length: columns }, (_, index) => {
      const cell = cells[index] ?? "";
      return normalizeXlsxCell(cell).style === undefined ? xlsxCell(normalizeXlsxCell(cell).value, style) : cell;
    });
  const headerRow = [
    text.day,
    text.date,
    text.role,
    text.entrance,
    text.exit,
    text.notes,
    text.regular,
    "125%",
    text.night130,
    "150%",
    "162.5%",
    text.holiday,
    "175%",
    "200%",
    text.summary,
    payrollAmountLabel,
  ].map((value) => xlsxCell(value, 1));
  const detailRows = payroll.rows.length
    ? payroll.rows.map((row) => {
        const rowStyle = row.dayName.includes("Fri") || row.dayName.includes("שישי") ? 7 : row.dayName.includes("Sat") || row.dayName.includes("שבת") ? 8 : 14;
        return [
          row.dayName,
          row.date,
          translatedText(payrollRoleLabel(payrollUser)),
          row.clockIn,
          row.clockOut,
          row.holidayNames || "",
          Number(row.regularHours.toFixed(2)),
          Number(row.overtimeHours.toFixed(2)),
          Number(row.nightHours.toFixed(2)),
          Number(row.holidayHours.toFixed(2)),
          Number(row.nightLastHour.toFixed(2)),
          row.holidayNames || "",
          "",
          "",
          Number(row.totalHours.toFixed(2)),
          payroll.payrollRate.undefinedSalary
            ? formatPayrollMoney(null)
            : Number((payroll.payrollRate.mode === "global" ? 0 : row.weightedPay).toFixed(2)),
        ].map((value) => xlsxCell(value, rowStyle));
      })
    : [padRow([isEnglishReport ? "No completed shifts in the selected date range." : "לא נמצאו משמרות שהושלמו בטווח התאריכים שנבחר."], 10)];

  const rows = [
    padRow([xlsxCell("FastShift", 3), "", "", "", "", "", "", "", "", "", "", "", "", "", xlsxCell(`${text.issueDate}: ${formatDate(new Date())}`, 3)], 3),
    padRow([xlsxCell(text.title, 11)], 5),
    padRow(
      [
        xlsxCell(text.employeeName, 12),
        xlsxCell(payrollUser.name, 13),
        "",
        xlsxCell(text.employeeNumber, 12),
        xlsxCell(payrollUser.employeeNumber || "-", 13),
        "",
        xlsxCell(text.betweenDates, 12),
        xlsxCell(reportRange, 13),
        "",
        xlsxCell(text.workingDays, 12),
        xlsxCell(workingDays, 13),
        "",
        xlsxCell(text.shifts, 12),
        xlsxCell(payroll.rows.length, 13),
      ],
      5,
    ),
    padRow(
      [
        xlsxCell(text.employmentContract, 12),
        xlsxCell(payroll.payrollRate.label, 13),
        "",
        xlsxCell(text.hourlyValue, 12),
        xlsxCell(formatPayrollMoney(payroll.payrollRate.undefinedSalary ? null : payroll.payrollRate.hourlyRate), 13),
        "",
        xlsxCell(text.totalHours, 12),
        xlsxCell(Number(payroll.totals.totalHours.toFixed(2)), 13),
      ],
      5,
    ),
    Array.from({ length: columns }, () => xlsxCell("", 0)),
    headerRow,
    ...detailRows,
    padRow(
      [
        isEnglishReport ? "General Summary" : "סיכום כללי",
        "",
        "",
        "",
        "",
        "",
        Number(payroll.totals.regularHours.toFixed(2)),
        Number(payroll.totals.overtimeHours.toFixed(2)),
        Number(payroll.totals.nightHours.toFixed(2)),
        Number(payroll.totals.holidayHours.toFixed(2)),
        Number(payroll.totals.nightLastHour.toFixed(2)),
        "",
        "",
        "",
        Number(payroll.totals.totalHours.toFixed(2)),
        payroll.payrollRate.undefinedSalary ? formatPayrollMoney(null) : Number(payroll.grossPay.toFixed(2)),
      ],
      9,
    ),
  ];

  return {
    rows,
    options: {
      widths: [12, 14, 16, 22, 22, 24, 13, 13, 13, 12, 13, 14, 11, 11, 13, 17],
      rowHeights: { 0: 24, 1: 34, 2: 26, 3: 30, 5: 28, 7: 27 },
      merges: ["A1:N1", "O1:P1", "A2:P2"],
    },
  };
}

function downloadFile(content, filename, type) {
  const blob = new Blob([`\ufeff${content}`], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

function downloadXlsx(rows, filename, sheetName) {
  const workbook = Array.isArray(rows) ? { rows, options: {} } : rows;
  downloadBlob(buildXlsx(workbook.rows, sheetName, workbook.options || {}), filename, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
}

async function exportHoursReport() {
  setActionOutput(reportNotice, currentLanguage === "he" ? "מכין קובץ אקסל להורדה..." : "Preparing Excel file for download...");
  try {
    const { data, selectedUser } = await fetchReportData();
    const employeeLabel = isManagerRole() ? selectedUser?.name || "כל-העובדים" : currentUser.name;
    const filename = `דוח-שעות-${safeFilePart(employeeLabel)}-${reportFrom.value}-${reportTo.value}.xlsx`;
    downloadXlsx(buildHoursReportExcel(data, selectedUser), filename, translatedText("דוח שעות"));
    setActionOutput(reportNotice, currentLanguage === "he" ? "קובץ דוח השעות נוצר ונשלח להורדה." : "The hours report file was created and downloaded.");
  } catch (error) {
    setActionOutput(reportNotice, error.message);
  }
}

async function exportPayrollReport() {
  setActionOutput(reportNotice, currentLanguage === "he" ? "מחשב שכר ומכין קובץ אקסל להורדה..." : "Calculating payroll and preparing Excel file...");
  try {
    const payrollUser = getPayrollUser();
    const { data } = await fetchReportData();
    await ensureHolidaysForRange(reportFrom.value, reportTo.value);
    const filename = `חישוב-שכר-${safeFilePart(payrollUser.name)}-${reportFrom.value}-${reportTo.value}.xlsx`;
    downloadXlsx(buildPayrollWorkbookRows(data, payrollUser), filename, currentLanguage === "en" ? "Payroll" : "חישוב שכר");
    setActionOutput(reportNotice,
      currentLanguage === "he"
        ? `קובץ חישוב השכר של ${payrollUser.name} נוצר ונשלח להורדה.`
        : `${payrollUser.name}'s payroll file was created and downloaded.`);
  } catch (error) {
    setActionOutput(reportNotice, error.message);
  }
}

async function loadUsers() {
  users = await request("/api/users");
}

async function loadAttendance() {
  const departmentQuery = isSystemAdmin() ? `?department=${encodeURIComponent(selectedScheduleDepartment)}` : "";
  attendanceLog = await request(`/api/attendance${departmentQuery}`);
}

async function loadAvailability() {
  const departmentQuery = isSystemAdmin() ? `?department=${encodeURIComponent(selectedScheduleDepartment)}` : "";
  availabilityEntries = await request(`/api/availability${departmentQuery}`);
}

async function loadSchedule() {
  currentSchedule = await request(`/api/schedules/${toDateInput(selectedWeekStart)}?department=${encodeURIComponent(selectedScheduleDepartment)}`);
}

async function loadJewishHolidays() {
  try {
    const weekEnd = addDays(selectedWeekStart, 6);
    const today = new Date();
    const start = toDateInput(selectedWeekStart < today ? selectedWeekStart : today);
    const end = toDateInput(weekEnd > today ? weekEnd : today);
    const cacheKey = `${start}:${end}`;
    if (jewishHolidayCache.has(cacheKey)) {
      jewishHolidays = jewishHolidayCache.get(cacheKey);
      return;
    }
    jewishHolidays = await request(`/api/jewish-holidays?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`);
    jewishHolidayCache.set(cacheKey, jewishHolidays);
  } catch (error) {
    jewishHolidays = [];
    console.warn("Jewish holidays could not be loaded", error);
  }
}

async function loadNotificationSchedules() {
  const currentWeekStart = startOfWeek(new Date());
  const nextWeekStart = addDays(currentWeekStart, 7);
  const department = getNotificationDepartment();
  const schedules = await Promise.all(
    [currentWeekStart, nextWeekStart].map((weekStart) => request(`/api/schedules/${toDateInput(weekStart)}?department=${encodeURIComponent(department)}`)),
  );
  notificationSchedules = schedules;
  notificationAssignments = schedules.filter((schedule) => schedule.published).flatMap((schedule) => schedule.assignments || []);
}

async function renderReports() {
  const renderId = ++reportRenderId;
  setActionOutput(reportNotice, currentLanguage === "he" ? "מפיק דוח..." : "Generating report...");
  try {
    const { data, selectedUser } = await fetchReportData();
    if (renderId !== reportRenderId) return;
    renderReportData(data);
    setActionOutput(reportNotice,
      currentLanguage === "he"
        ? !isManagerRole()
          ? `הדוח מציג את השעות שלך בלבד. נמצאו ${data.metrics.totalShifts} רשומות.`
          : selectedUser
            ? `הדוח מציג את הנתונים של ${selectedUser.name}. נמצאו ${data.metrics.totalShifts} רשומות.`
            : `הדוח מסווג לפי עובד ומוין לפי תאריך. נמצאו ${data.metrics.totalShifts} רשומות.`
        : !isManagerRole()
          ? `The report shows only your hours. ${data.metrics.totalShifts} records found.`
          : selectedUser
            ? `The report shows data for ${selectedUser.name}. ${data.metrics.totalShifts} records found.`
            : `The report is grouped by employee and sorted by date. ${data.metrics.totalShifts} records found.`);
  } catch (error) {
    if (renderId !== reportRenderId) return;
    setActionOutput(reportNotice, error.message);
  }
}

async function refreshAll(updateLoggedUser = true, options = {}) {
  const shouldRefreshReports = options.refreshReports ?? isViewActive("reports");
  await Promise.all([loadUsers(), loadAttendance(), loadAvailability(), loadSchedule(), loadJewishHolidays(), loadNotificationSchedules()]);
  if (updateLoggedUser) updateCurrentUser(currentUser.email);
  renderSchedule();
  renderAssignmentSchedule();
  renderAssignments();
  renderSchedulingAvailability();
  renderEmployees();
  renderPermissions();
  renderAttendanceUserSelect();
  renderAttendance();
  renderReportUserSelect();
  if (shouldRefreshReports && isAuthenticated && can("reports")) await renderReports();
  renderNotificationSettings();
  renderHome();
  sendDueShiftReminders();
  translateStaticContent();
}

async function createUser(event) {
  event.preventDefault();
  if (!can("manageUsers")) {
    setActionOutput(verificationNotice, "אין הרשאה להוספת משתמשים.");
    return;
  }
  setActionOutput(verificationNotice, "שולח הזמנה...");
  const payload = {
    name: document.querySelector("#newUserName").value.trim(),
    email: document.querySelector("#newUserEmail").value.trim().toLowerCase(),
    phone: document.querySelector("#newUserPhone").value.trim(),
    employeeNumber: document.querySelector("#newUserEmployeeNumber").value.trim(),
    department: isSystemAdmin() ? newUserDepartment.value : currentUser.department || "NOC",
    role: newUserRole.value,
  };
  try {
    const result = await request("/api/users/invite", { method: "POST", body: JSON.stringify(payload) });
    userCreateForm.reset();
    setActionOutput(
      verificationNotice,
      result.emailSent
        ? `נשלחו פרטי התחברות זמניים וקישור אימות אל ${payload.email}.`
        : `המשתמש נוצר, אבל SMTP לא מוגדר. קישור בדיקה: ${result.verifyUrl}`,
    );
    await refreshAll();
  } catch (error) {
    setActionOutput(verificationNotice, error.message);
  }
}

async function registerUser(event) {
  event.preventDefault();
  registerNotice.textContent = "יוצר משתמש ושולח מייל אימות...";
  const payload = {
    name: document.querySelector("#registerName").value.trim(),
    email: document.querySelector("#registerEmail").value.trim().toLowerCase(),
    department: registerDepartment.value,
    role: registerRole.value,
  };

  try {
    const result = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    registerForm.reset();
    registerNotice.textContent = result.emailSent
      ? `המשתמש נוצר ונשלחו פרטי התחברות זמניים וקישור אימות אל ${payload.email}.`
      : `המשתמש נוצר, אבל SMTP לא מוגדר. קישור בדיקה: ${result.verifyUrl}`;
  } catch (error) {
    registerNotice.textContent = error.message;
  }
}

function buildPublishPayload() {
  return getVisibleAssignmentDraft().map((assignment) => ({
    shiftDate: toDateInput(assignment.shiftDate),
    shiftLabel: assignment.shiftLabel,
    shiftTime: assignment.shiftTime,
    userId: assignment.userId,
  }));
}

async function toggleAssignmentFromPanel(userId) {
  if (!can("schedule")) return;
  if (!selectedAssignmentSlot || !userId) {
    setActionOutput(scheduleNotice, "יש לבחור משמרת בטבלה לפני שיבוץ עובד/ת.");
    return;
  }

  const dateKey = selectedAssignmentSlot.date;
  const shiftLabel = selectedAssignmentSlot.shiftLabel;
  const shiftTime = selectedAssignmentSlot.shiftTime;
  const user = users.find((item) => item.id === userId);
  const draftAssignmentsForWeek = getCurrentDraftAssignments();
  const serverAssignment = currentSchedule.assignments?.find((assignment) => isSameAssignmentSlot(assignment, dateKey, shiftLabel, userId));
  const draftAssignment = draftAssignmentsForWeek.find((assignment) => isSameAssignmentSlot(assignment, dateKey, shiftLabel, userId));
  const manualAssignment = getManualAttendanceAssignments(getVisibleAssignmentDraft()).find((assignment) =>
    isSameAssignmentSlot(assignment, dateKey, shiftLabel, userId),
  );

  if (draftAssignment || (serverAssignment && !isRemovedAssignment(serverAssignment))) {
    setActionOutput(scheduleNotice, "העובד/ת כבר משובץ/ת למשמרת הזו. הסרה או עריכת שעות מתבצעת בעמוד סידור שבועי דרך כפתור עריכה.");
    renderSchedulingAvailability();
    translateStaticContent();
    return;
  }

  if (manualAssignment) {
    setActionOutput(scheduleNotice, "לא ניתן לשבץ את העובד/ת למשמרת הזו כי כבר הוזנו לו/לה שעות ידנית לאותה משמרת.");
    renderSchedulingAvailability();
    translateStaticContent();
    return;
  }

  if (serverAssignment) {
    setCurrentDraftRemovals(getCurrentDraftRemovals().filter((assignmentId) => assignmentId !== serverAssignment.id));
  } else {
      const nextAssignment = { userId, shiftDate: dateKey, shiftLabel, shiftTime };
      if (!confirmAvailabilityNote(user, nextAssignment)) {
        setActionOutput(scheduleNotice, "השיבוץ בוטל לאחר צפייה בהערת הזמינות.");
        return;
      }
      const shortRestConflict = getShortRestConflict(nextAssignment);
      if (!confirmShortRestAssignment(user, shortRestConflict, nextAssignment)) {
        setActionOutput(scheduleNotice, "השיבוץ בוטל בגלל התראת מנוחה קצרה בין משמרות.");
        return;
      }
      if (!confirmNightShiftLimit(user, nextAssignment)) {
        setActionOutput(scheduleNotice, "השיבוץ בוטל בגלל התראת עומס משמרות לילה.");
        return;
      }
      if (!(await confirmConsecutiveSaturdayLimit(user, nextAssignment))) {
        setActionOutput(scheduleNotice, "השיבוץ בוטל בגלל התראת רצף שבתות.");
        return;
      }
      setCurrentDraftAssignments([
        ...draftAssignmentsForWeek,
        {
          id: `draft-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`,
          isDraft: true,
          shiftDate: dateKey,
          shiftLabel,
          shiftTime,
          userId,
          employee: user?.name || "עובד/ת",
          email: user?.email || "",
          role: user?.role || "",
        },
      ]);
    selectedAssignmentDate = parseDateOnly(dateKey);
    localStorage.setItem(sessionKeys.assignmentDate, dateKey);
    setActionOutput(scheduleNotice, "השיבוץ נוסף לטיוטה. הפרסום ישמור אותו בפועל.");
  }

  renderAssignmentSchedule();
  translateStaticContent();
}

async function publishSchedule() {
  if (!can("publishSchedule")) {
    setActionOutput(scheduleNotice, "אין הרשאה לפרסום סידור.");
    return;
  }
  await request(`/api/schedules/${toDateInput(selectedWeekStart)}/publish-draft`, {
    method: "POST",
    body: JSON.stringify({ department: getManagedDepartment(), assignments: buildPublishPayload() }),
  });
  setCurrentDraftAssignments([]);
  setCurrentDraftRemovals([]);
  setActionOutput(scheduleNotice, "הסידור פורסם ונשמר בפועל.");
  await refreshAll();
  renderNotifications();
  switchView("weekly");
}

function startWeeklyEdit() {
  if (!canEditWeeklySchedule()) return;
  weeklyEditMode = true;
  weeklyEditRemovals = new Set();
  weeklyEditAttendanceRemovals = new Set();
  weeklyManualEdits = new Map();
  setWeeklyNotice("מצב עריכה פעיל. ניתן להסיר עובדים או לעדכן שעות, ואז ללחוץ שמירה.");
  renderSchedule();
  applyRoleAccess();
}

function cancelWeeklyEdit() {
  weeklyEditMode = false;
  weeklyEditRemovals = new Set();
  weeklyEditAttendanceRemovals = new Set();
  weeklyManualEdits = new Map();
  setWeeklyNotice("עריכת הסידור בוטלה.");
  renderSchedule();
  applyRoleAccess();
}

async function saveWeeklyEdits() {
  if (!weeklyEditMode || !canEditWeeklySchedule()) return;
  saveWeeklyScheduleEdits.disabled = true;
  const originalText = saveWeeklyScheduleEdits.textContent;
  saveWeeklyScheduleEdits.textContent = "שומר...";
  try {
    for (const assignmentId of weeklyEditRemovals) {
      if (String(assignmentId).startsWith("draft-")) continue;
      await deleteIfExists(`/api/schedules/assignments/${assignmentId}`);
    }
    for (const attendanceId of weeklyEditAttendanceRemovals) {
      await deleteIfExists(`/api/attendance/${attendanceId}`);
    }

    const assignmentsByKey = new Map(getPublishedAssignmentsWithManual().map((assignment) => [getWeeklyManualEditKey(assignment), assignment]));
    for (const [key, times] of weeklyManualEdits) {
      const assignment = assignmentsByKey.get(key);
      if (!assignment || !assignment.userId || weeklyEditRemovals.has(assignment.id)) continue;
      await request("/api/attendance/manual", {
        method: "POST",
        body: JSON.stringify({
          userId: assignment.userId,
          department: assignment.department || getManagedDepartment(),
          date: toDateInput(assignment.shiftDate),
          shiftLabel: assignment.shiftLabel,
          clockIn: times.clockIn,
          clockOut: times.clockOut,
        }),
      });
    }

    weeklyEditMode = false;
    weeklyEditRemovals = new Set();
    weeklyEditAttendanceRemovals = new Set();
    weeklyManualEdits = new Map();
    setWeeklyNotice("השינויים נשמרו. שעות שנערכו סומנו כהזנה ידנית בתיעוד הנוכחות.");
    await refreshAll();
  } catch (error) {
    setWeeklyNotice(error.message);
  } finally {
    saveWeeklyScheduleEdits.disabled = false;
    saveWeeklyScheduleEdits.textContent = originalText;
    applyRoleAccess();
  }
}

async function deleteIfExists(path) {
  try {
    await request(path, { method: "DELETE" });
  } catch (error) {
    if (!String(error.message || "").includes("404")) throw error;
  }
}

function saveScheduleDraft() {
  if (!can("schedule")) {
    setActionOutput(scheduleNotice, "אין הרשאה לשמירת טיוטת סידור.");
    return;
  }
  saveDraftAssignments();
  saveDraftRemovals();
  localStorage.setItem(sessionKeys.weekStart, toDateInput(selectedWeekStart));
  localStorage.setItem(sessionKeys.assignmentDate, toDateInput(selectedAssignmentDate));

  const draftCount = getCurrentDraftAssignments().length;
  const removalCount = getCurrentDraftRemovals().length;
  setActionOutput(
    scheduleNotice,
    draftCount || removalCount
      ? `הטיוטה נשמרה. ${draftCount} שיבוצים ו-${removalCount} הסרות יוצגו כאן עד לפרסום הסידור.`
      : "הטיוטה נשמרה. אין שינויים חדשים לפרסום כרגע.",
  );
  renderAssignmentSchedule();
  translateStaticContent();
}

async function saveAvailability(event) {
  event.preventDefault();
  const userId = document.querySelector("#availabilityUser").value;
  const selectedUser = users.find((user) => user.id === userId);
  if (!userId) {
    setActionOutput(availabilityNotice, "אין עובד פעיל לשמירת זמינות.");
    return;
  }
  if (selectedUser?.email !== currentUser.email) {
    setActionOutput(availabilityNotice, "ניתן לעדכן זמינות רק עבור המשתמש המחובר.");
    return;
  }
  const entries = Array.from(document.querySelectorAll("[data-availability-toggle]"))
    .map((input) => {
      const noteInput = document.querySelector(
        `[data-availability-note][data-shift-date="${input.dataset.shiftDate}"][data-shift-label="${input.dataset.shiftLabel}"]`,
      );
      const note = noteInput?.value.trim() || "";
      const existing = availabilityEntries.find(
        (entry) => entry.userId === userId && entry.date === input.dataset.shiftDate && entry.shiftLabel === input.dataset.shiftLabel,
      );
      const nextEntry = {
        date: input.dataset.shiftDate,
        shiftLabel: input.dataset.shiftLabel,
        note,
        status: input.checked ? "זמין/ה" : note ? "לא זמין/ה" : "",
      };
      const currentStatus = existing?.status || "";
      const currentNote = existing?.note || "";
      return currentStatus === nextEntry.status && currentNote === nextEntry.note ? null : nextEntry;
    })
    .filter(Boolean);
  if (!entries.length) {
    setActionOutput(availabilityNotice, "אין שינויים חדשים לשמירה.");
    return;
  }
  setActionOutput(availabilityNotice, "שומר זמינות...");
  await request("/api/availability/bulk", {
    method: "POST",
    body: JSON.stringify({ userId, entries }),
  });
  for (const entry of entries) {
    availabilityEntries = availabilityEntries.filter(
      (item) => !(item.userId === userId && item.date === entry.date && item.shiftLabel === entry.shiftLabel),
    );
    if (entry.status) {
      availabilityEntries.push({ ...entry, userId, userName: selectedUser.name });
    }
  }
  renderAvailabilitySchedule();
  renderSchedulingAvailability();
  setActionOutput(availabilityNotice, "הזמינות השבועית עודכנה.");
  translateStaticContent();
}

async function saveSingleAvailabilityNote(noteInput) {
  const userId = document.querySelector("#availabilityUser").value;
  const selectedUser = users.find((user) => user.id === userId);
  if (!userId || selectedUser?.email !== currentUser.email) return;

  const checkbox = document.querySelector(
    `[data-availability-toggle][data-shift-date="${noteInput.dataset.shiftDate}"][data-shift-label="${noteInput.dataset.shiftLabel}"]`,
  );
  const note = noteInput.value.trim();
  const payload = {
    userId,
    date: noteInput.dataset.shiftDate,
    shiftLabel: noteInput.dataset.shiftLabel,
    note,
  };

  if (checkbox?.checked || note) {
    await request("/api/availability", {
      method: "POST",
      body: JSON.stringify({ ...payload, status: checkbox?.checked ? "זמין/ה" : "לא זמין/ה" }),
    });
  } else {
    await request("/api/availability", {
      method: "DELETE",
      body: JSON.stringify(payload),
    });
  }

  await loadAvailability();
  renderSchedulingAvailability();
  setActionOutput(availabilityNotice, note ? "הערת הזמינות נשמרה." : "הערת הזמינות נמחקה.");
}

async function verifyUser(userId) {
  if (!can("manageUsers")) return;
  await request(`/api/users/${userId}/verify-admin`, { method: "POST" });
  await refreshAll();
}

async function updateUserRole(userId, role) {
  if (!can("manageUsers")) return;
  await request(`/api/users/${userId}/role`, { method: "PATCH", body: JSON.stringify({ role }) });
  await refreshAll();
}

async function updateEmployeeDetails(userId) {
  if (!can("manageUsers")) return;
  const user = users.find((item) => item.id === userId);
  const fieldElements = document.querySelectorAll(`[data-employee-user="${userId}"]`);
  const payload = [...fieldElements].reduce((details, field) => {
    details[field.dataset.employeeField] = field.value.trim();
    return details;
  }, { department: user?.department || currentUser.department || "NOC" });
  await request(`/api/users/${userId}/details`, { method: "PATCH", body: JSON.stringify(payload) });
  await refreshAll();
}

async function saveAllEmployeeDetails() {
  if (!can("manageUsers") || !employeeEditMode) return;
  const saveButton = document.querySelector("#saveEmployeeDetails");
  const originalText = saveButton.textContent;
  saveButton.textContent = "שומר...";
  saveButton.disabled = true;
  try {
    const activeUsers = users.filter((user) => user.status === "active" && (isSystemAdmin() ? isDepartmentTeamMember(user, selectedScheduleDepartment) : isDepartmentTeamMember(user, currentUser.department || "NOC")));
    for (const user of activeUsers) {
      const fieldElements = document.querySelectorAll(`[data-employee-user="${user.id}"]`);
      if (!fieldElements.length) continue;
      const payload = [...fieldElements].reduce((details, field) => {
        details[field.dataset.employeeField] = field.value.trim();
        return details;
      }, { department: user.department || "NOC" });
      const unchanged =
        payload.name === (user.name || "") &&
        payload.employeeNumber === (user.employeeNumber || "") &&
        payload.role === (user.role || "") &&
        payload.email === (user.email || "") &&
        payload.phone === (user.phone || "") &&
        payload.employmentStatus === (user.employmentStatus || "משרה מלאה");
      if (unchanged) continue;
      await request(`/api/users/${user.id}/details`, { method: "PATCH", body: JSON.stringify(payload) });
    }
    employeeEditMode = false;
    await refreshAll();
  } catch (error) {
    setActionOutput(verificationNotice, error.message || (currentLanguage === "he" ? "עדכון הפרטים נכשל." : "Updating details failed."));
  } finally {
    saveButton.textContent = originalText;
    saveButton.disabled = false;
  }
}

async function deleteUser(userId) {
  if (!can("manageUsers")) return;
  const user = users.find((item) => item.id === userId);
  const confirmed = window.confirm(
    currentLanguage === "he"
      ? `האם למחוק את המשתמש ${user?.name || ""}?`
      : `Delete user ${user?.name || ""}?`,
  );
  if (!confirmed) return;
  await request(`/api/users/${userId}`, { method: "DELETE" });
  await refreshAll();
}

async function toggleClock() {
  const buttons = [clockToggle, homeClockButton].filter(Boolean);
  buttons.forEach((button) => {
    button.disabled = true;
  });
  setActionOutput(attendanceState, "מעדכן שעון משמרת...");
  try {
    const result = await request("/api/attendance/toggle", {
      method: "POST",
      body: JSON.stringify({ userId: currentUser.id, employee: currentUser.name, email: currentUser.email }),
    });
    if (result?.entry) {
      attendanceLog = result.action === "clock_out"
        ? attendanceLog.map((entry) => (entry.id === result.entry.id ? result.entry : entry))
        : [result.entry, ...attendanceLog.filter((entry) => entry.id !== result.entry.id)];
    } else {
      await loadAttendance();
    }
    renderAttendance();
    renderEmployees();
    renderHome();
    if (can("reports") && isViewActive("reports")) await renderReports();
    translateStaticContent();
  } catch (error) {
    setActionOutput(attendanceState, error.message);
  } finally {
    buttons.forEach((button) => {
      button.disabled = false;
    });
  }
}

function syncManualAttendanceTimes() {
  if (!manualAttendanceShift || !manualAttendanceClockIn || !manualAttendanceClockOut) return;
  const selected = manualAttendanceShift.selectedOptions[0];
  if (!manualAttendanceClockIn.value) manualAttendanceClockIn.value = selected?.dataset.start || "07:00";
  if (!manualAttendanceClockOut.value) manualAttendanceClockOut.value = selected?.dataset.end || "15:00";
}

function setManualShiftDefaultTimes() {
  if (!manualAttendanceShift || !manualAttendanceClockIn || !manualAttendanceClockOut) return;
  const selected = manualAttendanceShift.selectedOptions[0];
  manualAttendanceClockIn.value = selected?.dataset.start || "";
  manualAttendanceClockOut.value = selected?.dataset.end || "";
}

async function saveManualAttendance(event) {
  event.preventDefault();
  if (
    !manualAttendanceForm ||
    !manualAttendanceUser ||
    !manualAttendanceDate ||
    !manualAttendanceShift ||
    !manualAttendanceClockIn ||
    !manualAttendanceClockOut ||
    !manualAttendanceNotice
  ) {
    return;
  }
  if (!canManageManualAttendance()) return;
  setActionOutput(manualAttendanceNotice, "שומר שעות ידניות...");
  try {
    const selectedUser = users.find((user) => user.id === manualAttendanceUser.value);
    const duplicate = attendanceLog.some(
      (entry) =>
        selectedUser &&
        String(entry.email || "").toLowerCase() === String(selectedUser.email || "").toLowerCase() &&
        entry.shiftLabel === manualAttendanceShift.value &&
        toDateInput(entry.clockIn) === manualAttendanceDate.value,
    );
    if (duplicate) throw new Error("העובד/ת כבר הוזן/ה למשמרת הזו בתאריך הנבחר.");

    await request("/api/attendance/manual", {
      method: "POST",
      body: JSON.stringify({
        userId: manualAttendanceUser.value,
        department: getManagedDepartment(),
        date: manualAttendanceDate.value,
        shiftLabel: manualAttendanceShift.value,
        clockIn: manualAttendanceClockIn.value,
        clockOut: manualAttendanceClockOut.value,
      }),
    });
    setActionOutput(manualAttendanceNotice, "השעות נשמרו בתיעוד הנוכחות.");
    await loadAttendance();
    renderSchedule();
    renderAssignmentSchedule();
    renderAttendance();
    renderEmployees();
    if (can("reports") && isViewActive("reports")) await renderReports();
    translateStaticContent();
  } catch (error) {
    setActionOutput(manualAttendanceNotice, error.message);
  }
}

async function changeWeek(offset) {
  weeklyEditMode = false;
  weeklyEditRemovals = new Set();
  weeklyEditAttendanceRemovals = new Set();
  weeklyManualEdits = new Map();
  selectedWeekStart = addDays(selectedWeekStart, offset * 7);
  selectedAssignmentDate = parseDateOnly(selectedWeekStart);
  selectedAssignmentSlot = null;
  localStorage.setItem(sessionKeys.weekStart, toDateInput(selectedWeekStart));
  localStorage.setItem(sessionKeys.assignmentDate, toDateInput(selectedAssignmentDate));
  setActionOutput(scheduleNotice, "");
  await Promise.all([loadSchedule(), loadJewishHolidays()]);
  renderSchedule();
  renderAssignmentSchedule();
  renderAvailabilitySchedule();
  renderNotifications();
  translateStaticContent();
}

async function switchViewedDepartment(department) {
  selectedScheduleDepartment = department;
  weeklyEditMode = false;
  weeklyEditRemovals = new Set();
  weeklyEditAttendanceRemovals = new Set();
  weeklyManualEdits = new Map();
  selectedAssignmentSlot = null;
  localStorage.setItem("fastshift-schedule-department", selectedScheduleDepartment);
  if (scheduleDepartmentSelect) scheduleDepartmentSelect.value = selectedScheduleDepartment;
  if (employeeDepartmentSelect) employeeDepartmentSelect.value = selectedScheduleDepartment;
  await loadSchedule();
  await loadAttendance();
  await loadAvailability();
  await loadNotificationSchedules();
  renderSchedule();
  renderAssignmentSchedule();
  renderSchedulingAvailability();
  renderEmployees(getVisibleEmployeeList());
  renderReportUserSelect();
  renderAttendanceUserSelect();
  renderPermissions();
  applyRoleAccess();
  renderNotifications();
  translateStaticContent();
}

async function updateNotificationSetting(event) {
  const settings = loadNotificationSettings();
  const nextSettings = {
    ...settings,
    shiftReminders: shiftReminderSetting.checked,
    staffingShortage: staffingShortageSetting.checked,
  };
  saveNotificationSettings(nextSettings);
  setActionOutput(settingsNotice, "הגדרות ההתראות נשמרו.");

  if (event?.target === shiftReminderSetting && nextSettings.shiftReminders && "Notification" in window && Notification.permission === "default") {
    await Notification.requestPermission();
  }

  renderNotifications();
  sendDueShiftReminders();
}

function renderNotificationSettings() {
  const settings = loadNotificationSettings();
  shiftReminderSetting.checked = settings.shiftReminders;
  staffingShortageSetting.checked = settings.staffingShortage;
  renderNotifications();
}

function renderHome() {
  if (!document.querySelector("#home")) return;
  const activeEntry = getOpenAttendance();
  const activeUsers = getActiveUsers();
  const todayAssignments = getTodayAssignmentsForDashboard();
  const nextShift = getNextUserAssignment();
  const notificationItems = getNotificationItems();
  const openAttendance = attendanceLog.filter((entry) => !entry.clockOut);
  const monthlyHours = getUserHours(currentUser.email).toFixed(1);
  const pendingUsers = users.filter((user) => user.status === "pending_verification").length;
  const isManager = isManagerRole();
  const canSchedule = can("schedule");

  document.querySelector("#homeDateLabel").textContent = new Intl.DateTimeFormat(currentLocale(), {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
  document.querySelector("#homeGreeting").textContent = currentLanguage === "he" ? `שלום, ${currentUser.name}` : `Hello, ${currentUser.name}`;
  document.querySelector("#homeSummary").textContent = translatedText(
    canSchedule
      ? "כל מה שצריך לניהול המשמרות, הזמינות והצוות במקום אחד."
      : "המשמרות, הנוכחות והדוחות האישיים שלך מרוכזים כאן.",
  );
  document.querySelector("#homeClockStatus").textContent = activeEntry
    ? currentLanguage === "he"
      ? `פעילה מ-${formatDateTime(activeEntry.clockIn)}`
      : `Active since ${formatDateTime(activeEntry.clockIn)}`
    : translatedText("לא נמצאת משמרת פעילה");
  document.querySelector("#homeClockButton").textContent = activeEntry ? translatedText("יציאה ממשמרת") : translatedText("כניסה למשמרת");
  document.querySelector("#homeClockButton").classList.toggle("active", Boolean(activeEntry));

  const metrics = [
    { label: translatedText("עובדים פעילים"), value: activeUsers.length, show: can("viewEmployees") },
    { label: translatedText("משובצים היום"), value: todayAssignments.length, show: true },
    { label: translatedText("נוכחות פעילה"), value: canSchedule ? openAttendance.length : activeEntry ? 1 : 0, show: true },
    { label: translatedText("שעות החודש"), value: monthlyHours, show: true },
    { label: translatedText("ממתינים לאימות"), value: pendingUsers, show: isManager },
  ].filter((metric) => metric.show);

  document.querySelector("#homeMetrics").innerHTML = metrics
    .map(
      (metric) => `
        <article class="home-metric">
          <span>${metric.label}</span>
          <strong>${metric.value}</strong>
        </article>
      `,
    )
    .join("");

  document.querySelector("#homeNextShift").innerHTML = nextShift
    ? `
      <strong>${translatedText(nextShift.assignment.shiftLabel)} · ${nextShift.assignment.shiftTime}</strong>
      <span>${formatDayName(nextShift.startsAt)}, ${formatDate(nextShift.startsAt)} ${currentLanguage === "he" ? "בשעה" : "at"} ${formatTime(nextShift.startsAt)}</span>
    `
    : `<strong>${translatedText("אין משמרת קרובה")}</strong><span>${translatedText("כאשר יפורסם סידור עם משמרת עבורך, היא תופיע כאן.")}</span>`;

  document.querySelector("#homePublishedState").textContent = currentSchedule.published ? translatedText("סידור פורסם") : translatedText("לא פורסם עדיין");
  document.querySelector("#homeTodayList").innerHTML = todayAssignments.length
    ? todayAssignments
        .map(
          (assignment) => `
            <div class="home-shift-row ${assignment.shiftLabel === "בוקר" ? "morning" : assignment.shiftLabel === "ערב" ? "evening" : assignment.shiftLabel === "אמצע" ? "middle" : "night"}">
              <div>
                <strong>${translatedText(assignment.shiftLabel)}</strong>
                <span>${assignment.shiftTime}</span>
              </div>
              <span>${escapeHtml(assignment.employee)}</span>
            </div>
          `,
        )
        .join("")
    : `<div class="home-empty">${translatedText("אין משמרות להצגה היום.")}</div>`;

  document.querySelector("#homeAlertList").innerHTML = notificationItems.length
    ? notificationItems
        .slice(0, 4)
        .map(
          (item) => `
            <div class="home-alert ${item.type}">
              <strong>${item.title}</strong>
              <span>${item.text}</span>
            </div>
          `,
        )
        .join("")
    : `<div class="home-empty">${translatedText("אין התראות פעילות כרגע.")}</div>`;

  const actions = [
    { label: translatedText("סידור שבועי"), view: "weekly", show: true },
    { label: translatedText("שיבוץ עובדים"), view: "scheduling", show: canSchedule },
    { label: translatedText("זמינות למשמרות"), view: "availability", show: true },
    { label: translatedText("כניסה/יציאה ממשמרת"), view: "attendance", show: true },
    { label: translatedText("דוחות"), view: "reports", show: can("reports") },
    { label: translatedText("משתמשים והרשאות"), view: "users", show: can("manageUsers") },
  ].filter((action) => action.show && getPermissions().views.includes(action.view));

  document.querySelector("#homeQuickActions").innerHTML = actions
    .map((action) => `<button class="secondary-action" type="button" data-home-view="${action.view}">${action.label}</button>`)
    .join("");
}

function applyTheme(theme) {
  const normalizedTheme = theme === "dark" ? "dark" : "light";
  localStorage.setItem("fastshift-theme", normalizedTheme);
  const useDark = normalizedTheme === "dark";
  document.body.classList.toggle("theme-dark", useDark);
  document.querySelector("#themeSelect").value = normalizedTheme;
}

function exportEmployees() {
  if (!can("exportEmployees")) return;
  const visibleEmployees = getVisibleEmployeeList();
  const filename = `רשימת-עובדים-${toDateInput(new Date())}.xlsx`;
  downloadXlsx(buildEmployeesExcel(visibleEmployees), filename, translatedText("רשימת עובדים"));
}

function switchView(viewId) {
  if (!getPermissions().views.includes(viewId)) viewId = getPermissions().views[0];
  if (!isSystemAdmin() && viewId !== "weekly" && selectedScheduleDepartment !== (currentUser.department || "NOC")) {
    selectedScheduleDepartment = currentUser.department || "NOC";
    localStorage.setItem("fastshift-schedule-department", selectedScheduleDepartment);
    loadSchedule().then(() => {
      renderSchedule();
      renderAssignmentSchedule();
      renderHome();
      renderNotifications();
    });
  }
  localStorage.setItem(sessionKeys.view, viewId);
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === viewId));
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === viewId));
  viewTitle.textContent = t(viewId) || viewNames[viewId];
  if (viewId === "home") renderHome();
  if (viewId === "reports" && can("reports")) void renderReports();
  translateStaticContent();
  sidebar.classList.remove("open");
  applyRoleAccess();
}

function openLogoutModal() {
  document.querySelector("#logoutModal").classList.remove("hidden");
}

function closeLogoutModal() {
  document.querySelector("#logoutModal").classList.add("hidden");
}

function logout() {
  localStorage.removeItem(sessionKeys.email);
  localStorage.removeItem(sessionKeys.view);
  sessionStorage.removeItem(sessionKeys.activeBrowserSession);
  sessionStorage.removeItem(sessionKeys.authToken);
  authToken = "";
  isAuthenticated = false;
  currentUser = { ...fallbackUser };
  closeLogoutModal();
  appShell.classList.add("hidden");
  authShell.classList.remove("hidden");
  loginForm.reset();
  loginNotice.textContent = "";
  closeNotificationPopover();
  switchAuthMode("login");
}

function startAttendanceDeleteMode() {
  if (!can("clearAttendance")) return;
  attendanceDeleteMode = true;
  attendanceDeleteSelection = new Set();
  renderAttendance();
  setActionOutput(attendanceState, translatedText("מצב מחיקה פעיל. סמן רשומות למחיקה ואז לחץ שמירת מחיקות."));
  translateStaticContent();
}

async function saveAttendanceDeletes() {
  if (!can("clearAttendance")) return;
  if (!attendanceDeleteSelection.size) {
    attendanceDeleteMode = false;
    attendanceDeleteSelection = new Set();
    renderAttendance();
    translateStaticContent();
    return;
  }
  const ids = [...attendanceDeleteSelection];
  await Promise.all(ids.map((id) => request(`/api/attendance/${encodeURIComponent(id)}`, { method: "DELETE" })));
  attendanceDeleteMode = false;
  attendanceDeleteSelection = new Set();
  await refreshAll(true, { refreshReports: true });
  setActionOutput(attendanceState, translatedText("רשומות הנוכחות שנבחרו נמחקו."));
}

function cancelAttendanceDeletes() {
  attendanceDeleteMode = false;
  attendanceDeleteSelection = new Set();
  renderAttendance();
  setActionOutput(attendanceState, translatedText("מחיקת הנוכחות בוטלה."));
  translateStaticContent();
}

loginTab.addEventListener("click", () => switchAuthMode("login"));
registerTab.addEventListener("click", () => switchAuthMode("register"));
loginForm.addEventListener("submit", enterApp);
forgotPasswordForm.addEventListener("submit", requestPasswordReset);
document.querySelector("#forgotPasswordLink").addEventListener("click", () => {
  document.querySelector("#forgotEmail").value = document.querySelector("#loginEmail").value.trim().toLowerCase();
  switchAuthMode("forgot");
});
document.querySelector("#backToLogin").addEventListener("click", () => switchAuthMode("login"));
registerForm.addEventListener("submit", registerUser);
userCreateForm.addEventListener("submit", createUser);
registerDepartment.addEventListener("change", syncRegistrationRoleSelect);
newUserDepartment.addEventListener("change", () => syncRoleSelectForDepartment(newUserRole, newUserDepartment, isSystemAdmin(), false));
document.querySelector("#availabilityForm").addEventListener("submit", saveAvailability);
document.querySelector("#prevWeek").addEventListener("click", () => changeWeek(-1));
document.querySelector("#nextWeek").addEventListener("click", () => changeWeek(1));
editWeeklySchedule.addEventListener("click", startWeeklyEdit);
saveWeeklyScheduleEdits.addEventListener("click", saveWeeklyEdits);
cancelWeeklyScheduleEdits.addEventListener("click", cancelWeeklyEdit);
scheduleDepartmentSelect.addEventListener("change", async (event) => {
  await switchViewedDepartment(event.target.value);
});
employeeDepartmentSelect?.addEventListener("change", async (event) => {
  await switchViewedDepartment(event.target.value);
});
document.querySelector("#assignPrevWeek").addEventListener("click", () => changeWeek(-1));
document.querySelector("#assignNextWeek").addEventListener("click", () => changeWeek(1));
document.querySelector("#availabilityPrevWeek").addEventListener("click", () => changeWeek(-1));
document.querySelector("#availabilityNextWeek").addEventListener("click", () => changeWeek(1));
document.querySelector("#saveDraftSchedule")?.addEventListener("click", saveScheduleDraft);
document.querySelector("#publishSchedule").addEventListener("click", publishSchedule);
document.querySelector("#weekStatsToggle").addEventListener("click", () => toggleWeekStatsPanel());
document.querySelector("#minimizeWeekStats").addEventListener("click", () => toggleWeekStatsPanel(false));
document.querySelector("#exportEmployees").addEventListener("click", exportEmployees);
document.querySelector("#themeSelect").addEventListener("change", (event) => applyTheme(event.target.value));
document.querySelector("#languageSelect").addEventListener("change", (event) => applyLanguage(event.target.value));
document.querySelector("#availabilityUser").addEventListener("change", () => {
  renderAvailabilitySchedule();
  translateStaticContent();
});
document.querySelector("#availabilityScheduleGrid").addEventListener("focusout", async (event) => {
  const noteInput = event.target.closest("[data-availability-note]");
  if (!noteInput) return;
  try {
    await saveSingleAvailabilityNote(noteInput);
  } catch (error) {
    setActionOutput(availabilityNotice, error.message);
  }
});
document.querySelector("#logoutButton").addEventListener("click", openLogoutModal);
document.querySelector("#cancelLogout").addEventListener("click", closeLogoutModal);
document.querySelector("#confirmLogout").addEventListener("click", logout);
document.querySelector("#logoutModal").addEventListener("click", (event) => {
  if (event.target.id === "logoutModal") closeLogoutModal();
});
notificationButton.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleNotificationPopover();
});
document.querySelector("#closeNotifications").addEventListener("click", closeNotificationPopover);
document.addEventListener("click", (event) => {
  if (notificationPopover.classList.contains("hidden")) return;
  if (event.target.closest("#notificationPopover") || event.target.closest("#notificationButton")) return;
  closeNotificationPopover();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNotificationPopover();
});

document.querySelector("#mobileMenu").addEventListener("click", () => sidebar.classList.toggle("open"));
document.querySelectorAll(".nav-item").forEach((item) => item.addEventListener("click", () => switchView(item.dataset.view)));
document.querySelector("#employeeSearch").addEventListener("input", (event) => {
  const query = event.target.value.trim();
  renderEmployees(users.filter((user) => user.name.includes(query) || user.role.includes(query) || user.email.includes(query)));
});
document.querySelector("#editEmployees").addEventListener("click", () => {
  employeeEditMode = true;
  renderEmployees(getVisibleEmployeeList());
});
document.querySelector("#saveEmployeeDetails").addEventListener("click", saveAllEmployeeDetails);
document.querySelector("#permissionList").addEventListener("click", async (event) => {
  const verifyButton = event.target.closest("[data-verify-user]");
  if (verifyButton) await verifyUser(verifyButton.dataset.verifyUser);
  const deleteButton = event.target.closest("[data-delete-user]");
  if (deleteButton) await deleteUser(deleteButton.dataset.deleteUser);
});
document.querySelector("#permissionList").addEventListener("change", async (event) => {
  if (event.target.matches("[data-role-user]")) await updateUserRole(event.target.dataset.roleUser, event.target.value);
});
document.querySelector("#assignmentScheduleGrid").addEventListener("click", async (event) => {
  const shiftCard = event.target.closest("[data-select-shift]");
  if (shiftCard && !event.target.closest("[data-delete-assignment]")) {
    selectedAssignmentSlot = {
      date: shiftCard.dataset.shiftDate,
      shiftLabel: shiftCard.dataset.shiftLabel,
      shiftTime: shiftCard.dataset.shiftTime,
    };
    selectedAssignmentDate = parseDateOnly(selectedAssignmentSlot.date);
    localStorage.setItem(sessionKeys.assignmentDate, selectedAssignmentSlot.date);
    renderAssignmentSchedule();
    translateStaticContent();
    return;
  }
  const deleteButton = event.target.closest("[data-delete-assignment]");
  if (!deleteButton) return;
  if (!can("schedule")) return;
  removeAssignmentFromDraft(deleteButton.dataset.deleteAssignment, { confirm: false });
});
document.querySelector("#scheduleGrid").addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-weekly-delete-assignment]");
  if (deleteButton) removeWeeklyAssignment(deleteButton.dataset.weeklyDeleteAssignment);
});
document.querySelector("#scheduleGrid").addEventListener("change", (event) => {
  const input = event.target.closest("[data-weekly-edit-assignment]");
  if (input) {
    updateWeeklyManualEdit(input);
    closeTimePickerWhenComplete(input);
  }
});
document.querySelector("#scheduleGrid").addEventListener("input", (event) => {
  const input = event.target.closest("[data-weekly-edit-assignment]");
  if (input) {
    updateWeeklyManualEdit(input);
    closeTimePickerWhenComplete(input);
  }
});
document.querySelector("#schedulingAvailabilityList").addEventListener("click", async (event) => {
  const pickButton = event.target.closest("[data-pick-user]");
  if (pickButton) {
    try {
      await toggleAssignmentFromPanel(pickButton.dataset.pickUser);
    } catch (error) {
      setActionOutput(scheduleNotice, error.message);
    }
  }
});
clockToggle.addEventListener("click", toggleClock);
manualAttendanceForm?.addEventListener("submit", saveManualAttendance);
manualAttendanceShift?.addEventListener("change", setManualShiftDefaultTimes);
document.querySelector("#homeClockButton").addEventListener("click", toggleClock);
document.querySelector("#homeOpenNotifications").addEventListener("click", openNotificationPopover);
document.querySelector("#home").addEventListener("click", (event) => {
  const action = event.target.closest("[data-home-view]");
  if (action) switchView(action.dataset.homeView);
});
document.querySelector("#clearAttendance").addEventListener("click", startAttendanceDeleteMode);
document.querySelector("#saveAttendanceDeletes")?.addEventListener("click", async () => {
  try {
    await saveAttendanceDeletes();
  } catch (error) {
    setActionOutput(attendanceState, error.message);
  }
});
document.querySelector("#cancelAttendanceDeletes")?.addEventListener("click", cancelAttendanceDeletes);
document.querySelector("#attendanceRows").addEventListener("click", (event) => {
  const button = event.target.closest("[data-toggle-attendance-delete]");
  if (!button || !attendanceDeleteMode || !can("clearAttendance")) return;
  const id = button.dataset.toggleAttendanceDelete;
  attendanceDeleteSelection.add(id);
  renderAttendance();
});
document.querySelector("#generateReport").addEventListener("click", exportHoursReport);
document.querySelector("#calculatePayroll").addEventListener("click", exportPayrollReport);
document.querySelector("#showShiftReport").addEventListener("click", renderReports);
reportUser.addEventListener("change", markReportsDirty);
attendanceUser.addEventListener("change", async () => {
  attendanceDeleteMode = false;
  attendanceDeleteSelection = new Set();
  await loadAttendance();
  renderSchedule();
  renderAssignmentSchedule();
  renderAttendance();
  translateStaticContent();
});
reportFrom.addEventListener("change", markReportsDirty);
reportTo.addEventListener("change", markReportsDirty);
shiftReminderSetting.addEventListener("change", updateNotificationSetting);
staffingShortageSetting.addEventListener("change", updateNotificationSetting);

setInterval(() => {
  liveClock.textContent = new Intl.DateTimeFormat(currentLocale(), { timeStyle: "medium" }).format(new Date());
}, 1000);

setInterval(() => {
  renderNotifications();
  sendDueShiftReminders();
}, 60000);

applyTheme(localStorage.getItem("fastshift-theme") || "light");
applyLanguage(currentLanguage);
syncRegistrationRoleSelect();
syncRoleSelectForDepartment(newUserRole, newUserDepartment, false, false);
renderNotificationSettings();
Promise.resolve().then(async () => {
  const savedEmail = localStorage.getItem(sessionKeys.email);
  const activeBrowserSession = sessionStorage.getItem(sessionKeys.activeBrowserSession);
  const savedToken = sessionStorage.getItem(sessionKeys.authToken);
  if (savedEmail && savedToken && activeBrowserSession === savedEmail) {
    authToken = savedToken;
    try {
      const result = await request("/api/auth/me");
      await enterAuthenticatedApp(result.user, true);
      return;
    } catch {
      sessionStorage.removeItem(sessionKeys.activeBrowserSession);
      sessionStorage.removeItem(sessionKeys.authToken);
      localStorage.removeItem(sessionKeys.email);
      authToken = "";
    }
  }
  sessionStorage.removeItem(sessionKeys.activeBrowserSession);
  sessionStorage.removeItem(sessionKeys.authToken);
  authToken = "";
  authShell.classList.remove("hidden");
  appShell.classList.add("hidden");
  switchAuthMode("login");
  renderSchedule();
  renderAssignmentSchedule();
}).catch((error) => {
  setActionOutput(verificationNotice, `שגיאת חיבור לשרת: ${error.message}`);
  console.error(error);
});
