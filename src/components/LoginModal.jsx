const loginModal = ({ handleSubmit, register, onSubmit }) => {
    return (
        <div id="loginModal" className="modal fade" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content login-modal-content">

                    <button type="button" className="btn-close login-modal-close" data-bs-dismiss="modal" aria-label="Close"></button>

                    <div className="row g-0">

                        <div className="col-md-5 d-none d-md-block">
                            <div className="login-modal-image">
                                <img
                                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=800&fit=crop&crop=left&q=80"
                                    alt="旅行風景"
                                />
                                <div className="login-modal-image-overlay">
                                    <p className="login-modal-slogan">一起出發，<br />探索未知的旅程</p>
                                </div>
                            </div>
                        </div>


                        <div className="col-md-7">
                            <div className="login-modal-form-wrapper">
                                <h4 className="h4 trip-text-gray-800 mb-2">歡迎回來</h4>
                                <p className="trip-text-s trip-text-gray-400 mb-4">登入你的帳號，開始下一趟旅程</p>

                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="mb-3">
                                        <label className="form-label trip-text-s trip-text-gray-600 fw-bold">電子信箱</label>
                                        <input
                                            type="email"
                                            className="form-control login-modal-input"
                                            placeholder="example@mail.com"
                                            {...register("email")}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label trip-text-s trip-text-gray-600 fw-bold">密碼</label>
                                        <input
                                            type="password"
                                            className="form-control login-modal-input"
                                            placeholder="請輸入密碼"
                                            {...register("password")}
                                        />
                                    </div>
                                    <button type="submit" className="btn trip-btn-m trip-btn-primary w-100">
                                        登入
                                    </button>
                                </form>

                                <div className="login-modal-divider">
                                    <span>或</span>
                                </div>

                                <button type="button" className="btn trip-btn-m trip-btn-outline-primary w-100">
                                    註冊新帳號
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default loginModal;