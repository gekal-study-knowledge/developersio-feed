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
    year_str = now.strftime('%Y')
    month_str = now.strftime('%m')
    output_dir = os.path.join("_posts", year_str, month_str)
    os.makedirs(output_dir, exist_ok=True)
    # Jekyllの規約に合わせて YYYY-MM-DD-title.md 形式にする
    filename = os.path.join(output_dir, f"{date_str}-feed.md")

    # デバッグ用に昨日の記事も取得対象に含める（必要に応じて調整）
    # 実際には today だけで良いが、テスト時に記事がないとファイルが生成されないため
    # target_date = now.date()
    # target_date = (now - datetime.timedelta(days=1)).date() # テスト用

    existing_links = set()
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
            # 記事のリンクを探す (単純なリンク抽出)
            for entry in feed.entries:
                if entry.link in content:
                    existing_links.add(entry.link)

    entries_to_process = []
    feed.entries.reverse()
    for entry in feed.entries:
        # entry.published_parsed は UTC
        published_utc = datetime.datetime(*entry.published_parsed[:6], tzinfo=pytz.utc)
        published_jst = published_utc.astimezone(jst)

        # 指定した日のもの、かつ未追加のものだけ抽出
        if published_jst.date() == now.date() and entry.link not in existing_links:
            entries_to_process.append(entry)

    if not entries_to_process:
        print(f"No new entries found for {now.date()}.")
        return

    file_exists = os.path.exists(filename)
    if not file_exists:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write("---\n")
            f.write(f"layout: default\n")
            f.write(f"title: DevelopersIO Feed - {date_str}\n")
            f.write(f"last_updated: {now.strftime('%Y-%m-%d %H:%M:%S')} JST\n")
            f.write("---\n\n")
            f.write(f"# DevelopersIO RSS Feed - {date_str}\n\n")
            f.write(f"最終更新日: {now.strftime('%Y-%m-%d %H:%M:%S')} JST\n\n")
    else:
        # 既存ファイルのフロントマターを更新
        with open(filename, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        with open(filename, 'w', encoding='utf-8') as f:
            in_front_matter = False
            front_matter_count = 0
            updated_last_updated = False
            updated_body_last_updated = False
            
            for line in lines:
                if line.strip() == "---":
                    in_front_matter = not in_front_matter
                    front_matter_count += 1
                    f.write(line)
                    continue
                
                if in_front_matter and line.startswith("last_updated:"):
                    f.write(f"last_updated: {now.strftime('%Y-%m-%d %H:%M:%S')} JST\n")
                    updated_last_updated = True
                    continue

                if not in_front_matter and line.startswith("最終更新日:"):
                    f.write(f"最終更新日: {now.strftime('%Y-%m-%d %H:%M:%S')} JST\n")
                    updated_body_last_updated = True
                    continue
                
                # フロントマターの終わりに到達してもlast_updatedがなかったら追加（基本ないはずだが）
                if front_matter_count == 2 and not updated_last_updated and not in_front_matter:
                    # これは特殊なケース。本来は1回目のループで制御すべき
                    pass

                f.write(line)

            # 最終更新日の行が見つからなかった場合（既存ファイル用）
            if not updated_body_last_updated:
                # # タイトルの後あたりに挿入したいが、単純に末尾に追加するか、先頭付近を再構成するか
                # 既存ファイルへの対応は別途一括処理する方が安全
                pass

    with open(filename, 'a', encoding='utf-8') as f:
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

    if file_exists:
        print(f"Appended {len(entries_to_process)} new entries to {filename}")
    else:
        print(f"Generated {filename} with {len(entries_to_process)} entries")


if __name__ == "__main__":
    main()
