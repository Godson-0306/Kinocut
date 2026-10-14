"""Build placeholder posters, grain, and a compressed hero loop.

Prefers a free Pexels stock clip. If the download fails, renders an original
abstract loop from the brand palette so the page still has a video.
"""

from __future__ import annotations

import random
import subprocess
import urllib.request
from pathlib import Path

import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
VIDEOS = PUBLIC / "videos"
POSTERS = PUBLIC / "images" / "posters"
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

INK = (41, 40, 46)
INK_950 = (18, 18, 22)
BLUE = (67, 120, 160)
BLUE_300 = (143, 179, 210)
GREEN = (56, 105, 76)
GREEN_300 = (134, 188, 156)
PAPER = (244, 246, 245)
AMBER = (242, 184, 75)
WHITE = (255, 255, 255)

# Free-to-use Pexels files. First success wins.
STOCK_URLS = [
    "https://videos.pexels.com/video-files/3129671/3129671-hd_1920_1080_30fps.mp4",
    "https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_30fps.mp4",
    "https://videos.pexels.com/video-files/5495841/5495841-hd_1920_1080_25fps.mp4",
]

REELS = [
    ("reel-01.jpg", "wide", "01", "Northlane", BLUE, GREEN),
    ("reel-02.jpg", "tall", "02", "Fieldnote", GREEN, BLUE),
    ("reel-03.jpg", "wide", "03", "Orbit Kids", (31, 54, 73), BLUE_300),
    ("reel-04.jpg", "tall", "04", "Halcyon", GREEN, AMBER),
    ("reel-05.jpg", "wide", "05", "Lowtide", INK, BLUE),
    ("reel-06.jpg", "tall", "06", "Paperplane", BLUE, GREEN_300),
    ("reel-07.jpg", "wide", "07", "Lumen Lab", (26, 51, 36), GREEN_300),
    ("reel-08.jpg", "tall", "08", "Cassette", INK_950, BLUE_300),
]


def font(size: int) -> ImageFont.ImageFont:
    for path in (
        r"C:\Windows\Fonts\segoeuib.ttf",
        r"C:\Windows\Fonts\arialbd.ttf",
        r"C:\Windows\Fonts\arial.ttf",
    ):
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def grain() -> None:
    img = Image.new("L", (180, 180))
    pixels = img.load()
    rng = random.Random(14)
    for y in range(180):
        for x in range(180):
            pixels[x, y] = rng.randint(0, 255)
    img.save(PUBLIC / "grain.png")


def hero_poster() -> None:
    img = Image.new("RGB", (1920, 1080), INK_950)
    overlay = Image.new("RGB", img.size, INK_950)
    draw = ImageDraw.Draw(overlay)
    draw.ellipse((-200, -120, 1100, 900), fill=BLUE)
    draw.ellipse((900, 200, 2200, 1300), fill=GREEN)
    overlay = overlay.filter(ImageFilter.GaussianBlur(90))
    img = Image.blend(img, overlay, 0.55)
    img.save(VIDEOS / "hero-poster.jpg", quality=82, optimize=True)


def reel_poster(name: str, aspect: str, index: str, title: str, a: tuple[int, int, int], b: tuple[int, int, int]) -> None:
    size = (1280, 720) if aspect == "wide" else (720, 1280)
    img = Image.new("RGB", size, INK_950)
    wash = Image.new("RGB", size, INK_950)
    draw = ImageDraw.Draw(wash)
    draw.ellipse((-80, -40, int(size[0] * 0.8), int(size[1] * 0.7)), fill=a)
    draw.rectangle((40, int(size[1] * 0.62), size[0] - 40, size[1] - 40), fill=b)
    wash = wash.filter(ImageFilter.GaussianBlur(28))
    img = Image.blend(img, wash, 0.85)
    pen = ImageDraw.Draw(img)
    pen.text((48, 48), index, font=font(72), fill=WHITE)
    pen.text((48, size[1] - 120), title, font=font(42), fill=WHITE)
    img.save(POSTERS / name, quality=84, optimize=True)


def download_stock() -> Path | None:
    dest = VIDEOS / "stock-source.mp4"
    for url in STOCK_URLS:
        try:
            print(f"trying {url}")
            req = urllib.request.Request(url, headers={"User-Agent": "KinocutMedia/1.0"})
            with urllib.request.urlopen(req, timeout=40) as response:
                if response.status != 200:
                    continue
                data = response.read(28_000_000)
                if len(data) < 200_000:
                    continue
                dest.write_bytes(data)
                (VIDEOS / "SOURCE.txt").write_text(
                    "Hero placeholder footage\n"
                    f"Source: {url}\n"
                    "License: Pexels License (free to use, replace with your own masters).\n",
                    encoding="utf-8",
                )
                return dest
        except Exception as error:
            print(f"skip: {error}")
    return None


def run(args: list[str]) -> None:
    subprocess.run([FFMPEG, "-y", *args], check=True)


def transcode(source: Path) -> None:
    run(
        [
            "-ss",
            "0",
            "-t",
            "12",
            "-i",
            str(source),
            "-an",
            "-vf",
            "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=24,hue=h=24:s=0.5,eq=brightness=-0.05:contrast=1.08",
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-crf",
            "30",
            "-maxrate",
            "2400k",
            "-bufsize",
            "4800k",
            "-movflags",
            "+faststart",
            str(VIDEOS / "hero.mp4"),
        ]
    )
    run(
        [
            "-i",
            str(VIDEOS / "hero.mp4"),
            "-an",
            "-vf",
            "scale=1280:720",
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-crf",
            "32",
            "-maxrate",
            "900k",
            "-bufsize",
            "1800k",
            "-movflags",
            "+faststart",
            str(VIDEOS / "hero-mobile.mp4"),
        ]
    )
    webm = [
        "-i",
        str(VIDEOS / "hero.mp4"),
        "-an",
        "-c:v",
        "libvpx-vp9",
        "-b:v",
        "0",
        "-crf",
        "38",
        "-deadline",
        "realtime",
        "-cpu-used",
        "6",
        str(VIDEOS / "hero.webm"),
    ]
    try:
        run(webm)
    except subprocess.CalledProcessError:
        print("webm encode skipped")
    run(
        [
            "-ss",
            "1",
            "-i",
            str(VIDEOS / "hero.mp4"),
            "-frames:v",
            "1",
            "-q:v",
            "4",
            str(VIDEOS / "hero-poster.jpg"),
        ]
    )


def abstract_loop() -> None:
    """Original palette loop used only when stock download fails."""
    hero_poster()
    run(
        [
            "-loop",
            "1",
            "-i",
            str(VIDEOS / "hero-poster.jpg"),
            "-t",
            "12",
            "-vf",
            "zoompan=z='min(1.08,1+0.0006*on)':d=288:s=1920x1080:fps=24",
            "-an",
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-crf",
            "28",
            "-movflags",
            "+faststart",
            str(VIDEOS / "hero.mp4"),
        ]
    )
    (VIDEOS / "SOURCE.txt").write_text(
        "Hero placeholder is an original abstract loop generated from the brand palette.\n"
        "Replace public/videos/hero.mp4, hero.webm, hero-mobile.mp4, and hero-poster.jpg.\n",
        encoding="utf-8",
    )
    transcode(VIDEOS / "hero.mp4")


def main() -> None:
    VIDEOS.mkdir(parents=True, exist_ok=True)
    POSTERS.mkdir(parents=True, exist_ok=True)
    grain()
    for reel in REELS:
        reel_poster(*reel)
    source = download_stock()
    if source:
        transcode(source)
        source.unlink(missing_ok=True)
    else:
        abstract_loop()
    for path in sorted(VIDEOS.iterdir()):
        print(f"{path.name:24} {path.stat().st_size / 1_000_000:.2f} MB")


if __name__ == "__main__":
    main()
