import React, { useState, useEffect } from 'react';
import AdminLayout from "../layout/AdminLayout";

const SettingPage = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [language, setLanguage] = useState('en'); // Mặc định ngôn ngữ là tiếng Anh
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
    const [message, setMessage] = useState(''); // Hiển thị thông báo

    useEffect(() => {
        const storedDarkMode = localStorage.getItem('darkMode') === 'true';
        const storedLanguage = localStorage.getItem('language') || 'en';
        const storedNotifications = localStorage.getItem('notifications') === 'true';

        setIsDarkMode(storedDarkMode);
        setLanguage(storedLanguage);
        setIsNotificationsEnabled(storedNotifications);

        if (storedDarkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(prevState => {
            const newDarkMode = !prevState;
            localStorage.setItem('darkMode', newDarkMode);
            document.body.classList.toggle('dark', newDarkMode);
            return newDarkMode;
        });
    };

    const handleLanguageChange = (e) => {
        const selectedLanguage = e.target.value;
        setLanguage(selectedLanguage);
        localStorage.setItem('language', selectedLanguage);
    };

    const toggleNotifications = () => {
        setIsNotificationsEnabled(prevState => {
            const newStatus = !prevState;
            localStorage.setItem('notifications', newStatus);
            return newStatus;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('Cài đặt đã được lưu thành công!');
        setTimeout(() => setMessage(''), 3000); // Ẩn thông báo sau 3 giây
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-8">Cài đặt chung</h1>

                {message && (
                    <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-md">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Dark Mode */}
                    <div className="mb-4">
                        <label className="text-sm font-medium text-gray-700">Chế độ tối</label>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={isDarkMode}
                                onChange={toggleDarkMode}
                                className="ml-2"
                            />
                            <span className="ml-2">Bật/Tắt Dark Mode</span>
                        </div>
                    </div>

                    {/* Language Selection */}
                    <div className="mb-4">
                        <label className="text-sm font-medium text-gray-700">Ngôn ngữ</label>
                        <select
                            value={language}
                            onChange={handleLanguageChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="en">English</option>
                            <option value="vi">Tiếng Việt</option>
                            <option value="fr">Français</option>
                            <option value="es">Español</option>
                        </select>
                    </div>

                    {/* Notifications */}
                    <div className="mb-4">
                        <label className="text-sm font-medium text-gray-700">Thông báo</label>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={isNotificationsEnabled}
                                onChange={toggleNotifications}
                                className="ml-2"
                            />
                            <span className="ml-2">Bật/Tắt thông báo</span>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Lưu cài đặt
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default SettingPage;
