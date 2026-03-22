import re
import datetime
import requests
import feedparser
import pytz
from bs4 import BeautifulSoup
from pathlib import Path


def get_ogp_image(url):
    try:
        # User-Agentを指定するとスクレイピングの成功率が上がります
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()  # HTTPエラー（404や500など）があれば例外を発生させる

        soup = BeautifulSoup(response.text, 'html.parser')
        og_image = soup.find('meta', property='og:image')
        if og_image and og_image.get('content'):
            return og_image['content']
    except requests.RequestException as e:
        print(f"Error fetching URL {url}: {e}")
    except Exception as e:
        print(f"Error parsing OGP for {url}: {e}")
    return None


def main():
    feed_url = "https://dev.classmethod.jp/feed/"
    feed = feedparser.parse(feed_url)

    jst = pytz.timezone('Asia/Tokyo')
    now = datetime.datetime.now(jst)
    date_str = now.strftime('%Y-%m-%d')

    # 1. パスの設定 (pathlibを利用)
    output_dir = Path("_posts") / now.strftime('%Y') / now.strftime('%m')
    output_dir.mkdir(parents=True, exist_ok=True)
    file_path = output_dir / f"{date_str}-feed.md"

    existing_links = set()
    existing_articles = ""

    # 2. 既存ファイルの読み込みとデータ抽出（1回で済ませる）
    if file_path.exists():
        content = file_path.read_text(encoding='utf-8')

        # 正規表現で記事の見出しリンクを正確に抽出
        # 画像(OGP)のリンクなどを誤検知しないように "## [" から始まるものを探す
        existing_links = set(re.findall(r'## \[.*?\]\((https?://.*?)\)', content))

        # ファイルから「記事本文部分（最初の "## [" 以降すべて）」を抽出
        match = re.search(r'(## \[.*)', content, flags=re.DOTALL)
        if match:
            existing_articles = match.group(1)
            # 末尾の改行を保証
            if not existing_articles.endswith("\n"):
                existing_articles += "\n"

    entries_to_process = []
    # 3. 記事のフィルタリング (古いものから順に処理するために reversed)
    for entry in reversed(feed.entries):
        # JST変換を1回だけ行い、entryオブジェクトに持たせておく
        published_utc = datetime.datetime(*entry.published_parsed[:6], tzinfo=pytz.utc)
        published_jst = published_utc.astimezone(jst)

        if published_jst.date() == now.date() and entry.link not in existing_links:
            entry.published_jst = published_jst
            entries_to_process.append(entry)

    if not entries_to_process:
        print(f"No new entries found for {now.date()}.")
        return

    # 4. 新規記事のMarkdownを生成
    new_articles_md = ""
    for entry in entries_to_process:
        new_articles_md += f"## [{entry.title}]({entry.link})\n"
        new_articles_md += f"公開日時: {entry.published_jst.strftime('%Y-%m-%d %H:%M:%S')} JST\n\n"

        og_image = get_ogp_image(entry.link)
        if og_image:
            new_articles_md += f"![Preview]({og_image})\n\n"

        if 'summary' in entry:
            # strip=Trueを追加し、前後の不要な空白や改行を除去
            summary = BeautifulSoup(entry.summary, 'html.parser').get_text(strip=True)
            new_articles_md += f"{summary[:200]}...\n\n"

        new_articles_md += "---\n\n"

    # 5. 全体の構成を組み立てる
    all_articles_md = existing_articles + new_articles_md
    news_counter = len(existing_links) + len(entries_to_process)
    now_str = now.strftime('%Y-%m-%d %H:%M:%S')

    # f-stringの複数行文字列でFront Matterとヘッダーをスッキリ記述
    front_matter_and_header = f"""---
layout: default
title: DevelopersIO Fed - {date_str}
news_counter: {news_counter}
last_updated: {now_str} JST
---

# DevelopersIO RSS Feed - {date_str}

最終更新日: {now_str} JST

"""

    # 6. 1回の操作でファイルへ書き込み（上書き）
    file_path.write_text(front_matter_and_header + all_articles_md, encoding='utf-8')

    action = "Appended to" if existing_articles else "Generated"
    print(f"{action} {file_path} with {len(entries_to_process)} new entries. Total: {news_counter}")

if __name__ == "__main__":
    main()
