/**
 * ORBITA5: Certificate Generator & Share
 * Genera un certificado visual en Canvas y lo comparte vía Web Share API
 * (WhatsApp, Telegram, etc.) o lo descarga como imagen PNG.
 */

class CertificateGenerator {

  async generate(state) {
    const scoreData = state.calculateFinalScore();
    const isVictory = state.gameResult === 'VICTORY';
    const W = 1080;
    const H = 1350;

    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    // ——— FONDO ESPACIAL ———
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#030612');
    bgGrad.addColorStop(0.5, '#0a1628');
    bgGrad.addColorStop(1, '#050d1a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Estrellas
    for (let i = 0; i < 180; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.7 + 0.3})`;
      ctx.beginPath();
      ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 1.8 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // ——— BORDE EXTERIOR ELEGANTE ———
    ctx.strokeStyle = 'rgba(0, 210, 211, 0.6)';
    ctx.lineWidth = 4;
    this.roundRect(ctx, 30, 30, W - 60, H - 60, 24);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(0, 210, 211, 0.2)';
    ctx.lineWidth = 1.5;
    this.roundRect(ctx, 45, 45, W - 90, H - 90, 18);
    ctx.stroke();

    // ——— ENCABEZADO ———
    ctx.textAlign = 'center';

    // Título principal
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 54px system-ui, sans-serif';
    ctx.fillText(isVictory ? 'MISIÓN CUMPLIDA' : 'MISIÓN EVACUADA', W / 2, 175);

    // Subtítulo
    ctx.font = 'bold 28px Fredoka, system-ui, sans-serif';
    ctx.fillStyle = '#00d2d3';
    ctx.fillText('ORBITA5: COMANDANTE LUNAR', W / 2, 230);

    // ——— TROFEO (victoria) O ICONO DE ALERTA (derrota) ———
    const medalY = 345;
    const medalSize = 85;
    ctx.font = `${medalSize}px system-ui, sans-serif`;
    // En victoria mostramos un trofeo dorado en lugar de una medalla
    const trophyIcon = isVictory ? '🏆' : scoreData.medal;
    ctx.fillText(trophyIcon, W / 2, medalY);

    // Nombre del jugador con resplandor
    ctx.shadowColor = 'rgba(0, 210, 211, 0.6)';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px system-ui, sans-serif';
    ctx.fillText(state.playerName.toUpperCase(), W / 2, medalY + 80);
    ctx.shadowBlur = 0;

    // Rango
    ctx.fillStyle = '#feca57';
    ctx.font = 'bold 26px system-ui, sans-serif';
    ctx.fillText(scoreData.rank, W / 2, medalY + 120);

    // ——— LÍNEA DIVISORA ———
    const lineY = 520;
    const lineGrad = ctx.createLinearGradient(100, 0, W - 100, 0);
    lineGrad.addColorStop(0, 'rgba(0,210,211,0)');
    lineGrad.addColorStop(0.5, 'rgba(0,210,211,0.8)');
    lineGrad.addColorStop(1, 'rgba(0,210,211,0)');
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, lineY);
    ctx.lineTo(W - 100, lineY);
    ctx.stroke();

    // ——— MÉTRICAS EN TARJETAS ———
    const metrics = [
      { label: 'PUNTUACIÓN FINAL', value: `${scoreData.score}`, icon: '⭐' },
      { label: 'DÍAS SOBREVIVIDOS', value: `${scoreData.daysSurvived} / ${scoreData.totalDays}`, icon: '📅' },
      { label: 'CIENCIA PRODUCIDA', value: `${scoreData.scienceCollected} pts`, icon: '🔬' }
    ];
    const cardW = 280;
    const cardH = 140;
    const cardGap = 30;
    const totalW = metrics.length * cardW + (metrics.length - 1) * cardGap;
    let startX = (W - totalW) / 2;
    const cardY = 560;

    metrics.forEach((m, i) => {
      const cx = startX + i * (cardW + cardGap);

      // Fondo de tarjeta
      ctx.fillStyle = 'rgba(14, 21, 38, 0.85)';
      this.roundRect(ctx, cx, cardY, cardW, cardH, 14);
      ctx.fill();
      ctx.strokeStyle = 'rgba(84, 160, 255, 0.35)';
      ctx.lineWidth = 1.5;
      this.roundRect(ctx, cx, cardY, cardW, cardH, 14);
      ctx.stroke();

      // Icono
      ctx.font = '36px system-ui, sans-serif';
      ctx.fillText(m.icon, cx + cardW / 2, cardY + 45);

      // Valor
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px system-ui, sans-serif';
      ctx.fillText(m.value, cx + cardW / 2, cardY + 85);

      // Etiqueta
      ctx.fillStyle = '#a4b0be';
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText(m.label, cx + cardW / 2, cardY + 115);
    });

    // ——— NIVEL DE DIFICULTAD ———
    const diffNames = { 1: 'Cadete (7 días)', 2: 'Especialista (14 días)', 3: 'Comandante (28 días)' };
    ctx.fillStyle = '#a4b0be';
    ctx.font = '20px system-ui, sans-serif';
    ctx.fillText(`Nivel de Misión: ${diffNames[state.difficulty] || 'Cadete'}`, W / 2, 750);

    // ——— RECURSOS FINALES ———
    const barY = 790;
    const barW = 700;
    const barH = 30;
    const barStartX = (W - barW) / 2;
    const resData = [
      { label: '💨 Oxígeno', val: state.resources.oxygen, color: '#00cec9' },
      { label: '⚡ Energía', val: state.resources.energy, color: '#feca57' },
      { label: '❤️ Salud', val: state.resources.health, color: '#ff6b81' },
      { label: '🛡️ Integridad', val: state.resources.integrity, color: '#54a0ff' }
    ];

    resData.forEach((r, i) => {
      const y = barY + i * 55;

      // Etiqueta
      ctx.textAlign = 'left';
      ctx.fillStyle = '#dfe6e9';
      ctx.font = '18px system-ui, sans-serif';
      ctx.fillText(r.label, barStartX, y - 5);

      // Valor numérico
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px system-ui, sans-serif';
      ctx.fillText(`${Math.round(r.val)}%`, barStartX + barW, y - 5);

      // Track
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      this.roundRect(ctx, barStartX, y + 2, barW, barH, 8);
      ctx.fill();

      // Fill
      const fillW = Math.max(0, (r.val / 100) * barW);
      ctx.fillStyle = r.color;
      this.roundRect(ctx, barStartX, y + 2, fillW, barH, 8);
      ctx.fill();
    });

    ctx.textAlign = 'center';

    // ——— LECCIÓN / MENSAJE ———
    const msgY = 1050;
    ctx.fillStyle = 'rgba(14, 21, 38, 0.8)';
    this.roundRect(ctx, 80, msgY - 30, W - 160, 90, 12);
    ctx.fill();
    ctx.strokeStyle = isVictory ? 'rgba(46, 213, 115, 0.5)' : 'rgba(255, 71, 87, 0.5)';
    ctx.lineWidth = 1.5;
    this.roundRect(ctx, 80, msgY - 30, W - 160, 90, 12);
    ctx.stroke();

    ctx.fillStyle = isVictory ? '#55efc4' : '#ff7675';
    ctx.font = '18px system-ui, sans-serif';
    const msg = isVictory
      ? 'Demostraste comprender las compensaciones reales (trade-offs) de la'
      : 'Aprendiste que en el espacio profundo cada recurso es vital.';
    const msg2 = isVictory
      ? 'supervivencia en el espacio profundo. ¡Futuro astronauta de Marte!'
      : '¡Inténtalo de nuevo y mejora tu estrategia de recursos!';
    ctx.fillText(msg, W / 2, msgY + 5);
    ctx.fillText(msg2, W / 2, msgY + 32);

    // ——— FECHA Y URL ———
    const footY = H - 80;
    ctx.fillStyle = '#636e72';
    ctx.font = '16px system-ui, sans-serif';
    const dateStr = new Date().toLocaleDateString('es-419', { year: 'numeric', month: 'long', day: 'numeric' });
    ctx.fillText(`Certificado generado el ${dateStr}`, W / 2, footY);
    ctx.fillText('Junior Astronaut Mission Trainer — NASA Space Apps Challenge', W / 2, footY + 25);

    return canvas;
  }

  roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  async shareOrDownload(state) {
    const canvas = await this.generate(state);

    try {
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const file = new File([blob], `orbita5-${state.playerName.replace(/\s/g, '-')}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${state.gameResult === 'VICTORY' ? '🏆 ¡Misión Cumplida!' : '⚠️ Misión Evacuada'} — ORBITA5`,
          text: `${state.playerName} ${state.gameResult === 'VICTORY' ? 'completó' : 'intentó'} una misión lunar de ${state.totalDays} días con ${state.resources.science} puntos de ciencia en ORBITA5. ¿Podrás superarlo? 🚀`,
          files: [file]
        });
        return 'shared';
      }
    } catch (err) {
      if (err.name === 'AbortError') return 'cancelled';
    }

    // Fallback: descarga directa
    const link = document.createElement('a');
    link.download = `orbita5-${state.playerName.replace(/\s/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    return 'downloaded';
  }
}

window.certificateGenerator = new CertificateGenerator();
