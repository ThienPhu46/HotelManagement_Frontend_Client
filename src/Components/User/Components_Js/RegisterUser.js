import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../Components_Css/RegisterUser.css";

function RegisterUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [accountId, setAccountId] = useState(null); 
  const navigate = useNavigate();
  const location = useLocation();
  
  const apiBaseUrl = "http://localhost:5282/api/auth";
  const accountsApiBaseUrl = "http://localhost:5282/api/accounts";

  // Hàm gửi OTP
  const sendOtp = async () => {
    try {
      const payload = { MaTaiKhoan: accountId, Email: email };
      await axios.post(`${apiBaseUrl}/resend-otp`, payload);
      setNotification({ message: "Mã OTP mới đã được gửi đến email của bạn!", type: 'success' });
    } catch (error) {
      setNotification({ 
        message: error.response?.data?.message || "Không thể gửi OTP. Vui lòng thử lại.", 
        type: 'error' 
      });
    }
  };

  useEffect(() => {
    // Kiểm tra trạng thái điều hướng từ LoginUser hoặc sessionStorage
    const pendingUserString = sessionStorage.getItem('pendingVerificationUser');
    if (location.state?.showOtpForm && location.state?.accountId && location.state?.emailForVerification && location.state?.username) {
      setAccountId(location.state.accountId);
      setEmail(location.state.emailForVerification);
      setUsername(location.state.username);
      setShowOtpForm(true);
      setNotification({ message: `Tài khoản của bạn chưa được kích hoạt. Vui lòng xác thực OTP.`, type: 'info' });
      // Tự động gửi OTP khi chuyển từ trang đăng nhập
      setIsLoading(true);
      sendOtp().finally(() => setIsLoading(false));
    } else if (pendingUserString) {
      const pendingUser = JSON.parse(pendingUserString);
      setAccountId(pendingUser.accountId);
      setEmail(pendingUser.email);
      setUsername(pendingUser.username);
      setShowOtpForm(true);
      setNotification({ message: `Tài khoản của bạn chưa được kích hoạt. Vui lòng xác thực OTP.`, type: 'info' });
    }
  }, [location.state]);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) => password.length >= 6;
  const isValidPhoneNumber = (phone) => /^0[0-9]{9}$/.test(phone);

  const validateUsername = async (username) => {
    if (!username) { setUsernameError("Tên tài khoản không được để trống"); return false; }
    try {
      const response = await fetch(`${accountsApiBaseUrl}/validate/username/${encodeURIComponent(username)}`);
      const result = await response.json();
      if (result.data) { setUsernameError("Tên tài khoản đã tồn tại"); return false; }
      setUsernameError(""); return true;
    } catch (error) { setUsernameError("Lỗi khi kiểm tra tên tài khoản."); return false; }
  };

  const validateEmail = async (email) => {
    if (!email || !isValidEmail(email)) { setEmailError("Email không hợp lệ"); return false; }
    try {
      const response = await fetch(`${accountsApiBaseUrl}/validate/email/${encodeURIComponent(email)}`);
      const result = await response.json();
      if (result.data) { setEmailError("Email đã tồn tại"); return false; }
      setEmailError(""); return true;
    } catch (error) { setEmailError("Lỗi khi kiểm tra email."); return false; }
  };

  const validatePassword = (password) => {
    if (!isValidPassword(password)) { setPasswordError("Mật khẩu phải có ít nhất 6 ký tự"); return false; }
    setPasswordError(""); return true;
  };

  const validatePhone = (phone) => {
    if (!isValidPhoneNumber(phone)) { setPhoneError("Số điện thoại không hợp lệ (10 chữ số, bắt đầu bằng 0)"); return false; }
    setPhoneError(""); return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ message: '', type: '' });
    setIsLoading(true);

    const isUsernameValid = await validateUsername(username);
    const isEmailValid = await validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isPhoneValid = validatePhone(phoneNumber);

    if (!isUsernameValid || !isEmailValid || !isPasswordValid || !isPhoneValid) {
      setIsLoading(false);
      return;
    }

    try {
      const payload = { 
        tenTaiKhoan: username, 
        matKhau: password, 
        tenHienThi: displayName, 
        email: email, 
        phone: phoneNumber
      };
      
      const response = await axios.post(`${apiBaseUrl}/register`, payload);

      if (response.data && response.data.success) {
        const newAccountId = Number(response.data.data.maTaiKhoan);
        setAccountId(newAccountId);
        
        sessionStorage.setItem('pendingVerificationUser', JSON.stringify({ 
          accountId: newAccountId,
          email: email, 
          username: username 
        }));
        
        setNotification({ message: response.data.message || "Vui lòng kiểm tra email để lấy mã OTP.", type: 'success' });
        setShowOtpForm(true);
      }
    } catch (error) {
      sessionStorage.removeItem('pendingVerificationUser');
      const errorMessage = error.response?.data?.message || "Lỗi kết nối hoặc tài khoản/email đã tồn tại.";
      setNotification({ message: errorMessage, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification({ message: '', type: '' });

    try {
      const payload = { 
        MaTaiKhoan: accountId, 
        OtpCode: otp, 
        Email: email 
      };
      const response = await axios.post(`${apiBaseUrl}/verify-otp`, payload);

      if (response.data && response.data.success) {
        sessionStorage.removeItem('pendingVerificationUser');
        setNotification({ message: "Kích hoạt tài khoản thành công! Đang chuyển đến trang đăng nhập...", type: 'success' });
        setTimeout(() => { navigate("/LoginUser"); }, 2000);
      } else {
        setNotification({ message: response.data.message || "Xác thực thất bại.", type: 'error' });
        setIsLoading(false);
      }
    } catch (error) {
       const errorMessage = error.response?.data?.message || "Mã OTP không đúng hoặc đã hết hạn.";
       setNotification({ message: errorMessage, type: 'error' });
       setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setNotification({ message: '', type: '' });
    await sendOtp();
    setIsLoading(false);
  };
  
  return (
    <div className="register-wrapper">
      <div className="register-container">
        <h1 className="register-title">{!showOtpForm ? 'ĐĂNG KÝ' : 'XÁC THỰC OTP'}</h1>
        
        {notification.message && (
          <div className={`notification notification-${notification.type}`}>
            {notification.message}
          </div>
        )}

        {!showOtpForm ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Tên tài khoản</label>
              <input id="username" type="text" placeholder="Nhập tên tài khoản" value={username} onChange={(e) => setUsername(e.target.value)} onBlur={() => validateUsername(username)} required />
              {usernameError && <span className="error-text">{usernameError}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input id="password" type="password" placeholder="Nhập mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} onBlur={() => validatePassword(password)} required />
              {passwordError && <span className="error-text">{passwordError}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="displayName">Tên hiển thị</label>
              <input id="displayName" type="text" placeholder="Nhập tên hiển thị" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="Nhập email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => validateEmail(email)} required />
              {emailError && <span className="error-text">{emailError}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Số điện thoại di động</label>
              <input id="phoneNumber" type="tel" placeholder="Nhập số điện thoại" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} onBlur={() => validatePhone(phoneNumber)} required />
              {phoneError && <span className="error-text">{phoneError}</span>}
            </div>
            <button type="submit" className="register-button" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <div className="form-group">
              <label htmlFor="otp">Mã OTP</label>
              <input id="otp" type="text" placeholder="Nhập mã OTP từ email" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            </div>
            <button type="submit" className="register-button" disabled={isLoading}>
              {isLoading ? "Đang xác thực..." : "Xác thực OTP"}
            </button>
            <button type="button" className="resend-otp-button" onClick={handleResendOtp} disabled={isLoading}>
              {isLoading ? "Đang gửi lại..." : "Gửi lại OTP"}
            </button>
          </form>
        )}

        {!showOtpForm && (
          <div className="login-text">
            <p>Bạn đã có tài khoản? <a href="/LoginUser" className="login-link">Đăng nhập ngay</a>.</p>
          </div>
        )}
        <div className="terms-text">
          <p>Bằng cách tiếp tục, bạn đồng ý với <a href="#" className="terms-link">Điều khoản và Điều kiện</a> và bạn đã được thông báo về <a href="#" className="terms-link">Chính sách bảo vệ dữ liệu</a> của chúng tôi.</p>
        </div>
      </div>
    </div>
  );
}

export default RegisterUser;