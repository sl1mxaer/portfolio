function alignVideosByHeight() {
    const rows = document.querySelectorAll('.video-row');
    rows.forEach(row => {
        const videos = Array.from(row.querySelectorAll('video'));
        if (videos.length === 0) return;

        // Собираем пропорции
        let videoData = [];
        let allLoaded = true;
        videos.forEach(video => {
            if (video.videoWidth && video.videoHeight) {
                videoData.push({
                    video,
                    ratio: video.videoWidth / video.videoHeight
                });
            } else {
                allLoaded = false;
                video.addEventListener('loadedmetadata', () => alignVideosByHeight());
            }
        });
        if (!allLoaded) return;

        // Убираем inline-стили
        videos.forEach(v => {
            v.style.width = '';
            v.style.height = '';
        });

        // Получаем ширину контейнера
        const containerWidth = row.clientWidth;
        const gaps = (videos.length - 1) * 20; // предположим gap 20px
        const availableWidth = containerWidth - gaps;

        // Ищем максимальную высоту, которая позволит вписаться в availableWidth
        let targetHeight = Math.max(...videos.map(v => v.offsetHeight));
        let totalWidth;
        do {
            totalWidth = videoData.reduce((sum, { ratio }) => sum + (targetHeight * ratio), 0);
            if (totalWidth > availableWidth) {
                targetHeight *= 0.98; // уменьшаем высоту на 2% до вписывания
            } else {
                break;
            }
        } while (totalWidth > availableWidth && targetHeight > 10);

        // Применяем высоту и ширину
        videoData.forEach(({ video, ratio }) => {
            const newWidth = targetHeight * ratio;
            video.style.height = targetHeight + 'px';
            video.style.width = newWidth + 'px';
        });
    });
}