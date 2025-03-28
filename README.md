## Created with Capacitor Create App

This app was created using [`@capacitor/create-app`](https://github.com/ionic-team/create-capacitor-app),
and comes with a very minimal shell for building an app.

### Running this example

Hướng dẫn chạy ứng dụng Đếm ngược sinh nhật
1. Cài đặt môi trường
Cài đặt Node.js và Android Studio.
2. Cài đặt và cấu hình dự án
- Khởi tạo dự án Capacitor: npm init @capacitor/app
- Cài đặt các thư viện cần thiết:
    npm install
    npm install @capacitor/core @capacitor/cli
    npm install @capacitor/android
- Thêm nền tảng Android:
    npx cap add android
- Xây dựng dự án:
    npm run build
- Đồng bộ các thay đổi vào dự án Android:
    npx cap copy
    npx cap sync
- Cài đặt plugin
  npm install @capacitor/local-notifications
  npm install @capacitor/share
- Chạy ứng dụng trên thiết bị Android:
    npx cap run android
3. Sau khi chạy ứng dụng:
  - Nhập ngày tháng: vd:2806
  - Nhấn nút "Tính ngày còn lại" để tính
  - Nhấn nút "Chia sẻ kết quả" để có thể share kết quả cho người khác
