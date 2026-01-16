// /js/result.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. 根据 h2 文字内容简单判断成功/失败状态（不依赖 class）
    const h2 = document.querySelector('h2');
    const msg = document.querySelector('p');
    const resultText = h2.textContent.trim().toLowerCase();

    let isSuccess = false;
    let icon = 'ℹ️'; // 默认中性

    if (resultText.includes('成功') || resultText.includes('success') || 
        resultText.includes('完成') || resultText.includes('ok')) {
        isSuccess = true;
        icon = '✅';
        h2.style.color = '#2d6a4f';           // 成功绿
    } else if (resultText.includes('失败') || resultText.includes('error') || 
               resultText.includes('出错') || resultText.includes('fail')) {
        icon = '❌';
        h2.style.color = '#c1121f';           // 失败红
    }

    // 在标题前插入图标（不改 HTML 结构）
    h2.innerHTML = `${icon} ${h2.innerHTML}`;

    // 2. 添加自动返回倒计时（放在卡片底部）
    const card = document.querySelector('.card');
    
    const countdown = document.createElement('div');
    countdown.style.marginTop = '1.8rem';
    countdown.style.fontSize = '0.95rem';
    countdown.style.color = '#555';
    card.appendChild(countdown);

    let seconds = 5;

    const updateCountdown = () => {
        countdown.textContent = `将在 ${seconds} 秒后自动返回首页...`;
        if (seconds <= 3) {
            countdown.style.color = seconds === 0 ? '#c1121f' : '#e76f51';
        }
        seconds--;

        if (seconds < 0) {
            clearInterval(timer);
            window.location.href = '/';
        }
    };

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown(); // 立即显示一次

    // 3. 鼠标悬停卡片时暂停倒计时（提升体验）
    let paused = false;
    card.addEventListener('mouseenter', () => {
        clearInterval(timer);
        countdown.textContent = '自动返回已暂停（鼠标悬停中）';
        countdown.style.color = 'var(--primary)';
        paused = true;
    });

    card.addEventListener('mouseleave', () => {
        if (paused && seconds > 0) {
            timer = setInterval(updateCountdown, 1000);
            paused = false;
        }
    });

    // 4. 可选：如果 msg 看起来像需要复制的内容（订单号/验证码等），加复制按钮
    if (msg.textContent.length > 6 && /[A-Za-z0-9]{6,}/.test(msg.textContent)) {
        const copyBtn = document.createElement('button');
        copyBtn.textContent = '复制信息';
        copyBtn.className = 'btn';
        copyBtn.style.marginTop = '1.2rem';
        copyBtn.style.backgroundColor = 'var(--gray)';
        copyBtn.style.padding = '0.7rem 1.6rem';

        copyBtn.onclick = () => {
            navigator.clipboard.writeText(msg.textContent.trim())
                .then(() => {
                    copyBtn.textContent = '已复制！';
                    copyBtn.style.backgroundColor = '#2d6a4f';
                    setTimeout(() => {
                        copyBtn.textContent = '复制信息';
                        copyBtn.style.backgroundColor = 'var(--gray)';
                    }, 1800);
                })
                .catch(() => {
                    copyBtn.textContent = '复制失败';
                    setTimeout(() => {
                        copyBtn.textContent = '复制信息';
                    }, 1500);
                });
        };

        card.appendChild(copyBtn);
    }
});