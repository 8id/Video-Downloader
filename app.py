from flask import Flask, request, render_template, jsonify, send_from_directory
import yt_dlp as youtube_dl
import os
import logging
import shutil
import validators
import secrets
import string
import subprocess

# Configure logging
logging.basicConfig(level=logging.ERROR, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = 'downloads'
VIDEO_FOLDER = os.path.join(UPLOAD_FOLDER, 'videos')
AUDIO_FOLDER = os.path.join(UPLOAD_FOLDER, 'audio')
ALLOWED_PLATFORMS = ['youtube.com', 'youtu.be', 'instagram.com', 'tiktok.com', 'facebook.com']
SECRET_KEY = secrets.token_hex(16)
app.config['SECRET_KEY'] = SECRET_KEY

# Create directories if they don't exist
os.makedirs(VIDEO_FOLDER, exist_ok=True)
os.makedirs(AUDIO_FOLDER, exist_ok=True)

# Helper Functions
def is_valid_url(url):
    """Validates if the URL is a valid URL and from supported platforms."""
    if not validators.url(url):
        return False
    return any(platform in url for platform in ALLOWED_PLATFORMS)

def generate_safe_filename(title):
    """Generates a safe filename from the video title."""
    safe_chars = "-_.() %s%s" % (string.ascii_letters, string.digits)
    filename = ''.join(c for c in title if c in safe_chars)
    return filename.strip()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/preview', methods=['POST'])
def preview():
    url = request.form['url']
    mode = request.form['mode']

    if not is_valid_url(url):
        return jsonify({'error': 'الرابط غير صالح أو غير مدعوم!'})

    try:
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'skip_download': True,
            'simulate': True,
            'encoding': 'utf-8',
            'noplaylist': True
        }
        
        if mode == 'audio':
            ydl_opts['format'] = 'bestaudio/best'
        else:
            ydl_opts['format'] = 'best'

        with youtube_dl.YoutubeDL(ydl_opts) as ydl:
            try:
                info = ydl.extract_info(url, download=False)
            except youtube_dl.utils.DownloadError as e:
                logging.error(f"yt-dlp download error: {e}")
                return jsonify({'error': 'فشل استخراج معلومات الفيديو. قد يكون الفيديو غير متاح.'})
            except Exception as e:
                logging.error(f"Error extracting info: {e}")
                return jsonify({'error': 'حدث خطأ غير متوقع أثناء استخراج المعلومات.'})

            if info is None:
                return jsonify({'error': 'فشل استخراج معلومات الفيديو.'})

            if mode == 'audio':
                return jsonify({
                    'title': info.get('title', 'غير متوفر'),
                    'duration': info.get('duration', 0),
                    'thumbnail': info.get('thumbnail', ''),
                    'qualities': [('bestaudio/best', 'صوت فقط')],
                    'mode': mode
                })

            formats = info.get('formats', [])
            unique_qualities = {}
            for f in formats:
                if f.get('vcodec') != 'none':
                    height = f.get('height', f.get('format_note', 'غير محدد'))
                    if height not in unique_qualities or f['format_id'] == 'best':
                        unique_qualities[height] = f['format_id']
            qualities = [(vid, str(label)) for label, vid in unique_qualities.items()]

            return jsonify({
                'title': info.get('title', 'غير متوفر'),
                'duration': info.get('duration', 0),
                'thumbnail': info.get('thumbnail', ''),
                'qualities': qualities,
                'mode': mode
            })

    except Exception as e:
        logging.error(f"Error in /preview: {e}")
        return jsonify({'error': 'حدث خطأ أثناء المعاينة. يرجى المحاولة مرة أخرى.'})

@app.route('/download', methods=['POST'])
def download():
    url = request.form['url']
    quality = request.form['quality']
    audio_only = request.form.get('audio_only', 'false').lower() == 'true'
    mode = request.form['mode']
    start_time = request.form.get('start_time', '0')
    end_time = request.form.get('end_time', None)

    if not is_valid_url(url):
        return jsonify({'error': 'الرابط غير صالح أو غير مدعوم!'})

    ffmpeg_path = shutil.which('ffmpeg')
    if not ffmpeg_path:
        return jsonify({'error': 'FFmpeg غير مثبت أو غير مضاف إلى PATH.'})

    output_dir = AUDIO_FOLDER if audio_only else VIDEO_FOLDER

    try:
        ydl_opts = {
            'outtmpl': os.path.join(output_dir, '%(title)s-%(id)s.%(ext)s'),
            'ffmpeg_location': ffmpeg_path,
            'quiet': True,
            'encoding': 'utf-8',
            'noplaylist': True
        }

        if audio_only:
            ydl_opts.update({
                'format': 'bestaudio/best',
                'extractaudio': True,
                'audioformat': 'mp3',
                'keepvideo': False,
            })
        else:
            ydl_opts.update({
                'format': f'bestvideo[format_id={quality}]+bestaudio/best',
                'merge_output_format': 'mp4',
            })

        with youtube_dl.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            original_file = ydl.prepare_filename(info)

        # القص يتم فقط إذا كان الوضع هو "trim"
        if mode == 'trim' and (start_time != '0' or end_time):
            output_file = os.path.join(output_dir, f"{generate_safe_filename(info['title'])}-{info['id']}-trimmed.{info['ext']}")
            ffmpeg_cmd = [
                ffmpeg_path,
                '-i', original_file,
                '-ss', start_time,
            ]
            if end_time:
                ffmpeg_cmd.extend(['-to', end_time])
            ffmpeg_cmd.extend([
                '-c', 'copy',
                '-y',
                output_file
            ])

            subprocess.run(ffmpeg_cmd, check=True)
            os.remove(original_file)
            return jsonify({'success': True, 'filename': os.path.basename(output_file)})

        return jsonify({'success': True, 'filename': os.path.basename(original_file)})
    except youtube_dl.utils.DownloadError as e:
        logging.error(f"Download error: {e}")
        return jsonify({'error': 'فشل تنزيل الفيديو. قد يكون الفيديو محميًا أو غير متوفر.'})
    except subprocess.CalledProcessError as e:
        logging.error(f"FFmpeg trimming error: {e}")
        return jsonify({'error': 'فشل قص الملف. تحقق من أوقات البداية والنهاية.'})
    except Exception as e:
        logging.error(f"Error in /download: {e}")
        return jsonify({'error': 'حدث خطأ أثناء التنزيل. يرجى المحاولة مرة أخرى.'})

@app.route('/downloads/<path:filename>')
def download_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)

@app.errorhandler(500)
def internal_server_error(e):
    logging.error(f"Internal Server Error: {e}")
    return jsonify({'error': 'حدث خطأ داخلي في الخادم. يرجى المحاولة مرة أخرى لاحقًا.'}), 500

if __name__ == '__main__':
    app.run(debug=True)