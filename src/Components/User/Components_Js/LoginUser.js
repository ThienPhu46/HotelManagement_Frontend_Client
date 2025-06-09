import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Components_Css/LoginUser.css";

function LoginUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showActivatePrompt, setShowActivatePrompt] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ message: '', type: '' });
    setShowActivatePrompt(false);
    
    if (!username || !password) {
      setNotification({ message: "Vui lòng nhập tên tài khoản và mật khẩu", type: 'error' });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post("http://localhost:5282/api/auth/login", {
        TenTaiKhoan: username,
        MatKhau: password
      });

      if (response.data && response.data.success) {
        const userData = response.data.data;
        if (userData.maVaiTro === 4) { 
          setNotification({ message: 'Đăng nhập thành công! Đang chuyển hướng...', type: 'success' });
          setTimeout(() => {
            localStorage.setItem("currentUser", JSON.stringify(userData));
            navigate("/HomeLoggedIn");
            window.location.reload();
          }, 2000);
        } else {
          setNotification({ message: "Bạn không có quyền đăng nhập vào trang này.", type: 'error' });
          setIsLoading(false);
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Tên tài khoản hoặc mật khẩu không đúng.";
      setNotification({ message: errorMessage, type: 'error' });
      if (errorMessage.includes("chưa được kích hoạt")) {
        // Kiểm tra sessionStorage để lấy thông tin tài khoản đang chờ xác thực
        const pendingUserString = sessionStorage.getItem('pendingVerificationUser');
        if (pendingUserString) {
          const pendingUser = JSON.parse(pendingUserString);
          if (pendingUser.username.toLowerCase() === username.toLowerCase()) {
            setShowActivatePrompt(true);
          } else {
            setNotification({ 
              message: "Tài khoản đang chờ xác thực không khớp. Vui lòng đăng ký lại.", 
              type: 'error' 
            });
          }
        } else {
          setNotification({ 
            message: "Không tìm thấy phiên đăng ký. Vui lòng đăng ký lại để nhận OTP.", 
            type: 'error' 
          });
        }
      }
      setIsLoading(false);
    } 
  };
  
  const handleActivateAndNavigate = () => {
    try {
      const pendingUserString = sessionStorage.getItem('pendingVerificationUser');
      if (!pendingUserString) {
        throw new Error("Không tìm thấy phiên đăng ký. Vui lòng vào trang Đăng ký và nhập lại thông tin để nhận OTP.");
      }
      const pendingUser = JSON.parse(pendingUserString);
      
      if (pendingUser.username.toLowerCase() !== username.toLowerCase()) {
        throw new Error("Tài khoản đang chờ xác thực không khớp. Vui lòng thử lại hoặc đăng ký mới.");
      }

      // Điều hướng đến trang RegisterUser với trạng thái yêu cầu hiển thị form OTP
      navigate('/RegisterUser', { 
        state: { 
          accountId: pendingUser.accountId, 
          emailForVerification: pendingUser.email,
          username: pendingUser.username,
          showOtpForm: true // Thêm cờ để hiển thị form OTP
        } 
      });
    } catch (error) {
      setNotification({ message: error.message, type: 'error' });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h1 className="login-title">ĐĂNG NHẬP</h1>

        {notification.message && (
          <div className={`notification notification-${notification.type}`}>
            {notification.message}
          </div>
        )}
        
        {showActivatePrompt && (
          <div className="activation-prompt" style={{backgroundColor: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '4px', padding: '15px', marginBottom: '15px', textAlign: 'center'}}>
            <p style={{margin: '0 0 10px 0', color: '#d46b08'}}>Tài khoản này cần được kích hoạt .</p>
            <button type="button" className="activate-button" style={{backgroundColor: '#fa8c16', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}} onClick={handleActivateAndNavigate}>
              Đến trang xác thực
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Tên tài khoản</label>
            <input id="username" type="text" placeholder="Nhập tên tài khoản" value={username} onChange={(e) => setUsername(e.target.value)} disabled={isLoading}/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="password-input-container">
              <input id="password" type={showPassword ? "text" : "password"} placeholder="Nhập mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading}/>
              <button type="button" className="password-toggle-button" onClick={togglePasswordVisibility} disabled={isLoading} aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>
                 {showPassword ? (
                  <span className="eye-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" x2="22" y1="2" y2="22"></line>
                    </svg>
                  </span>
                ) : (
                  <span className="eye-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </div>
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <div className="register-text">
          <p>Bạn đã có tài khoản? <a href="/RegisterUser" className="register-link">Đăng kí ngay</a>.</p>
        </div>

        <div className="terms-text">
          <p>Bằng cách tiếp tục, bạn đồng ý với <a href="#" className="terms-link">Điều khoản và Điều kiện</a> và bạn đã được thông báo về <a href="#" className="terms-link">Chính sách bảo vệ dữ liệu</a> của chúng tôi.</p>
        </div>
      </div>
    </div>
  );
}

export default LoginUser;