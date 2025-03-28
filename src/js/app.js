import { LocalNotifications } from '@capacitor/local-notifications';
import { Share } from '@capacitor/share';

window.customElements.define(
  'capacitor-birthday-countdown',
  class BirthdayCountdown extends HTMLElement {
    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });

      root.innerHTML = `
        <style>
          :host {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh; 
            background-color: #FFE4E1; 
            font-family: Arial, sans-serif;
          }

          .container {
            text-align: center;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            background-color: #FFD1DC; 
            max-width: 400px;
          }

          .input-field {
            margin-bottom: 15px;
            padding: 10px;
            width: calc(100% - 22px);
            border: 2px solid #FFB6C1;
            border-radius: 5px;
            font-size: 16px;
            text-align: center;
          }
          .button {
            padding: 10px 20px;
            background-color: #FFB6C1;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            margin: 5px;
            font-size: 16px;
          }
          .button:hover {
            background-color: #FF69B4;
          }
          .result {
            margin-top: 15px;
            font-size: 1.2em;
            color: #333;
          }
          .battery-status {
            margin-top: 15px;
            font-size: 1em;
            color: #666;
          }
        </style>
        <div class="container">
          <h1>Đếm ngược sinh nhật</h1>
          <input id="birthdate-input" class="input-field" type="text" maxlength="5" placeholder="Nhập ngày sinh (dd/MM)"/>
          <button class="button" id="calculate-button">Tính ngày còn lại</button>
          <button class="button" id="share-button">Chia sẻ kết quả</button>
          <div id="result" class="result"></div>
          <div id="battery-status" class="battery-status"></div>
        </div>
      `;
    }

    connectedCallback() {
      const birthdateInput = this.shadowRoot.querySelector('#birthdate-input');
      const resultDisplay = this.shadowRoot.querySelector('#result');
      const batteryStatusDisplay = this.shadowRoot.querySelector('#battery-status');
      const calculateButton = this.shadowRoot.querySelector('#calculate-button');
      const shareButton = this.shadowRoot.querySelector('#share-button');

      let remainingDays = null;

     
      birthdateInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); 
        if (value.length > 2) {
          value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
        }
        e.target.value = value;
      });

     
      async function requestNotificationPermission() {
        const status = await LocalNotifications.requestPermissions();
        if (status.receive !== 'granted') {
          alert('Quyền thông báo chưa được cấp. Vui lòng cấp quyền trong cài đặt.');
        }
      }

      requestNotificationPermission();

      calculateButton.addEventListener('click', async () => {
        const birthdateStr = birthdateInput.value.trim();
        const [day, month] = birthdateStr.split('/').map(Number);
        const today = new Date();
        const currentYear = today.getFullYear();
        const nextBirthday = new Date(currentYear, month - 1, day);

        if (isNaN(nextBirthday.getTime())) {
          resultDisplay.textContent = 'Vui lòng nhập ngày sinh hợp lệ (dd/MM).';
        } else {
          if (nextBirthday < today) {
            nextBirthday.setFullYear(currentYear + 1); 
          }
          remainingDays = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
          resultDisplay.textContent = `Còn ${remainingDays} ngày đến sinh nhật của bạn.`;

          await LocalNotifications.schedule({
            notifications: [
              {
                title: "Thông báo",
                body: `Còn ${remainingDays} ngày đến sinh nhật của bạn!`,
                id: 1,
                schedule: { at: new Date(Date.now() + 1000) },
              },
            ],
          });
        }
      });

      shareButton.addEventListener('click', async () => {
        if (remainingDays !== null) {
          const canShare = await Share.canShare();
          if (canShare.value) {
            await Share.share({
              title: 'Kết quả đếm ngược sinh nhật',
              text: `Còn ${remainingDays} ngày đến sinh nhật của Thúy!`,
              dialogTitle: 'Chia sẻ kết quả',
            });
          } else {
            alert('Thiết bị của bạn không hỗ trợ tính năng chia sẻ.');
          }
        } else {
          resultDisplay.textContent = 'Vui lòng tính ngày trước khi chia sẻ.';
        }
      });

      
      if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
          function updateBatteryStatus() {
            batteryStatusDisplay.textContent = `Trạng thái pin: ${Math.round(battery.level * 100)}% - ${battery.charging ? 'Đang sạc' : 'Không sạc'}`;
          }
          updateBatteryStatus();
          battery.addEventListener('chargingchange', updateBatteryStatus);
          battery.addEventListener('levelchange', updateBatteryStatus);
        });
      } else {
        batteryStatusDisplay.textContent = 'Trình duyệt không hỗ trợ API trạng thái pin.';
      }
    }
  }
);
