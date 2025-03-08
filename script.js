let isScrolled = false;
let startY = null;
let currentY = null;
let isAnimating = false;

// 桌面端：滚轮事件
window.addEventListener('wheel', (e) => {
    if (isAnimating) return;
    isAnimating = true;
    
    if (e.deltaY > 0 && !isScrolled) {
        // 切换到全屏
        isScrolled = true;
        document.querySelector('.title-section').style.transform = 'translateY(-100%)';
        document.querySelector('.content-section').style.top = '0';
    } else if (e.deltaY < 0 && isScrolled) {
        // 返回初始位置
        isScrolled = false;
        document.querySelector('.title-section').style.transform = 'translateY(0)';
        document.querySelector('.content-section').style.top = '33.33vh';
    }
    
    setTimeout(() => isAnimating = false, 500);
}, { passive: false });

// 移动端：触摸事件
window.addEventListener('touchstart', (e) => {
    if (isAnimating) return;
    startY = e.touches[0].clientY;
}, { passive: false });

window.addEventListener('touchmove', (e) => {
    if (!startY || isAnimating) return;
    currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;
    const viewportHeight = window.innerHeight;

    // 实时拖动效果
    if (!isScrolled && deltaY < 0) {
        const percentage = deltaY / viewportHeight;
        const titleMove = percentage * 100;
        const contentTop = 33.33 + (percentage * 33.33);
        
        document.querySelector('.title-section').style.transform = `translateY(${titleMove}%)`;
        document.querySelector('.content-section').style.top = `${Math.max(0, contentTop)}vh`;
    } else if (isScrolled && deltaY > 0) {
        const percentage = deltaY / viewportHeight;
        const titleMove = -100 + (percentage * 100);
        const contentTop = 0 + (percentage * 33.33);
        
        document.querySelector('.title-section').style.transform = `translateY(${titleMove}%)`;
        document.querySelector('.content-section').style.top = `${Math.min(33.33, contentTop)}vh`;
    }
}, { passive: false });

window.addEventListener('touchend', (e) => {
    if (!startY || isAnimating) return;
    isAnimating = true;

    const deltaY = currentY - startY;
    const viewportHeight = window.innerHeight;
    const percentage = Math.abs(deltaY / viewportHeight);

    // 判断滑动比例
    if (!isScrolled && deltaY < 0 && percentage > 0.3) {
        isScrolled = true;
        document.querySelector('.title-section').style.transform = 'translateY(-100%)';
        document.querySelector('.content-section').style.top = '0';
    } else if (isScrolled && deltaY > 0 && percentage > 0.3) {
        isScrolled = false;
        document.querySelector('.title-section').style.transform = 'translateY(0)';
        document.querySelector('.content-section').style.top = '33.33vh';
    } else {
        // 回弹到当前状态
        if (isScrolled) {
            document.querySelector('.title-section').style.transform = 'translateY(-100%)';
            document.querySelector('.content-section').style.top = '0';
        } else {
            document.querySelector('.title-section').style.transform = 'translateY(0)';
            document.querySelector('.content-section').style.top = '33.33vh';
        }
    }

    setTimeout(() => {
        isAnimating = false;
        startY = null;
        currentY = null;
    }, 500);
});