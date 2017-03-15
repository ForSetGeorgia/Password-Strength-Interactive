# scraper.rake
# encoding: UTF-8

require 'csv'
require 'nokogiri'
require 'mechanize'
require 'json'


# scraper for all alphabets, each alphabet has letters, each letter has block,
# alphabet letters can be in different blocks
# https://unicode-table.com/en/alphabets/
def scrape
  created_at = Time.now
  date = Time.now
  puts "Scrape for #{date.to_date} at #{date}"

    begin
      base_url = 'https://unicode-table.com'
      agent = Mechanize.new
      agent.verify_mode = OpenSSL::SSL::VERIFY_NONE
      alphabets_page = Nokogiri::HTML(agent.get("#{base_url}/en/alphabets/").content)
      nav = alphabets_page.css(".navigation")
      alphabet_links = nav.css("a")

      alphabets = {}

      alphabet_links.each_with_index {|link, i|
        alphabet = {}
        # next if !(i == 1 || i == 32 || i == 28)
        alphabet_url = link.attr("href") # /en/alphabets/armenian/

        alphabet[:title] = link.text
        alphabet[:letters] = []

        puts alphabet[:title]

        alphabet_page = Nokogiri::HTML(agent.get("#{base_url}#{alphabet_url}").content)
        letters_el = alphabet_page.css(".detailed-list li")

        letters_el.each {|letter_el|
          letter = {}
          letter[:letter] = letter_el.css(".char").text()


          desc = letter_el.css(".sdesc")

          title_element = desc.css(".stitle a")

          #letter[:url] = title_element.attr("href").text() # /en/0531/ hex code of character
          letter[:title] = title_element.text()

          block_element = desc.css(".sblock a")
          letter[:block] = block_element.attr("href").text().gsub("/en/blocks/","").gsub("/","")

          letter[:code] = desc.css(".code").text()
          # letter[:html_code] = desc.css(".html-code").text()

          alphabet[:letters] << letter
        }

        name = alphabet_url.gsub("/en/alphabets/","").gsub("/","")

        alphabets[name.to_sym] = alphabet
      }

      File.write("unicode_alphabets.json", JSON.pretty_generate(alphabets))
      File.write("unicode_alphabets.min.json", alphabets.to_json)

    rescue  Exception => e
      puts "#{e} - exception occured"
    end
  # end
end


# scraper for all blocks, alphabets letter is using reference to block,
# because alphabet can be in different blocks
# https://unicode-table.com/en/blocks/
def scrape_blocks
  created_at = Time.now
  date = Time.now
  puts "Scrape for #{date.to_date} at #{date}"

    begin
      base_url = 'https://unicode-table.com'
      agent = Mechanize.new
      agent.verify_mode = OpenSSL::SSL::VERIFY_NONE
      blocks_page = Nokogiri::HTML(agent.get("#{base_url}/en/blocks/").content)

      nav = blocks_page.css(".navigation")
      block_links = nav.css("a")

      blocks = {}

      # https://unicode-table.com/en/blocks/georgian/
      block_links.each_with_index {|link, i|

        # next if !(i == 1 || i == 32 || i == 28)

        block_url = link.attr("href")

        block_page = Nokogiri::HTML(agent.get("#{base_url}#{block_url}").content)
        name = block_url.gsub("/en/blocks/","").gsub("/","")

        puts name

        range = block_page.css("h1 .range").text().split("—").map!(&:strip)
        group_el = block_page.css(".group-info")
        count = group_el.css("#symb-count").text()
        type = group_el.css("#block-type").text()
        languages = group_el.css("li:nth-child(3) span").text().split(",").map!(&:strip)
        countries = group_el.css("li:nth-child(4) span").text().split(",").map!(&:strip)
        character_table_el = block_page.css(".unicode .unicode_table")
        character_els = character_table_el.css("li.symb:not(.inactive)")
        characters = []
        character_els.each{|character_el|
          character = {}
          character_a_el = character_el.css("a")
          character[:letter] = character_a_el.text()
          character[:url] = character_a_el.attr("href").text()
          character[:title] = character_el.attr("title")
          code = character[:url].gsub('/en/', '').gsub('/', '')
          character[:code] = "U+#{code}"
          character[:html_code] = "&##{code.to_i(16)};"
          characters << character
        }

        blocks[name.to_sym] = {
          url: block_url,
          name: link.text,
          range: range,
          count: count,
          type: type,
          languages: languages,
          countries: countries,
          characters: characters
        }
      }



      # puts blocks.inspect
      File.write("unicode_blocks.json", JSON.pretty_generate(blocks))
      File.write("unicode_blocks.min.json", blocks.to_json)

    rescue  Exception => e
      puts "#{e} - exception occured"
    end
  # end

end

def main
  scrape
  scrape_blocks
end

main
