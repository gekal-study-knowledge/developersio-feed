import feedparser
import datetime
import pytz
import os
import requests
import ssl
from bs4 import BeautifulSoup

if hasattr(ssl, '_create_unverified_context'):
    ssl._create_default_https_context = ssl._create_unverified_context

def get_ogp_image(url):
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        og_image = soup.find('meta', property='og:image')
        if og_image:
            return og_image['content']
    except Exception as e:
        print(f"Error fetching OGP for {url}: {e}")
    return None

def main():
    feed_url = "https://dev.classmethod.jp/feed/"
    feed = feedparser.parse(feed_url)
    
    jst = pytz.timezone('Asia/Tokyo')
    now = datetime.datetime.now(jst)
    yesterday = now - datetime.timedelta(days=1)
    
    # 日本時間の日付でファイル名を作成
    date_str = now.strftime('%Y-%m-%d')
    output_dir = "posts"
    os.makedirs(output_dir, exist_ok=True)
    filename = os.path.join(output_dir, f"{date_str}.md")

    # デバッグ用に昨日の記事も取得対象に含める（必要に応じて調整）
    # 実際には today だけで良いが、テスト時に記事がないとファイルが生成されないため
    # target_date = now.date()
    # target_date = (now - datetime.timedelta(days=1)).date() # テスト用

    entries_to_process = []
    for entry in feed.entries:
        # entry.published_parsed は UTC
        published_utc = datetime.datetime(*entry.published_parsed[:6], tzinfo=pytz.utc)
        published_jst = published_utc.astimezone(jst)
        
        # 指定した日のものだけ抽出
        if published_jst.date() == now.date():
            entries_to_process.append(entry)
            
    if not entries_to_process:
        print(f"No entries found for {now.date()}.")
        return

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(f"# DevelopersIO RSS Feed - {date_str}\n\n")
        for entry in entries_to_process:
            f.write(f"## [{entry.title}]({entry.link})\n")
            published_jst = datetime.datetime(*entry.published_parsed[:6], tzinfo=pytz.utc).astimezone(jst)
            f.write(f"公開日時: {published_jst.strftime('%Y-%m-%d %H:%M:%S')} JST\n\n")
            
            # プレビュー表示のためのOGP画像取得
            og_image = get_ogp_image(entry.link)
            if og_image:
                f.write(f"![Preview]({og_image})\n\n")
            
            # 要約があれば記載
            if 'summary' in entry:
                # HTMLタグを除去
                summary = BeautifulSoup(entry.summary, 'html.parser').get_text()
                f.write(f"{summary[:200]}...\n\n")
            
            f.write("---\n\n")

    print(f"Generated {filename}")

if __name__ == "__main__":
    main()
