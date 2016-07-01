//==UserScript==
//@name        SS Titles Check - Pseudospam
//@namespace   https://phototric.com/
//@description SS Pseudospam (2016) - simple tool for Shutterstock contributors, allowing to check the repeating keywords in image titles
//@include     http://www.shutterstock.com/*
//@include     http://submit.shutterstock.com/*
//@version     1
//@author      Plrang 
//@grant       none
//==/UserScript==


var submitter_id;
var _docLocation = window.location.href;


// CHECK IF PROFILE PAGE
var _match = /submit\.shutterstock\.com\/home\.mhtml/i.exec(_docLocation);

if (_match) {
    var profile_id = document.querySelector('.feedback-tab').href;
    _match = /submitter=(\d+)/i.exec(profile_id);
    submitter_id = _match[1];
    URL_to_titles = 'http://www.shutterstock.com/cat.mhtml?page=1&thumb_size=small&submitter_id='
            + submitter_id + '&search_type=gallery';

    document
            .getElementById('content_overview_container')
            .insertAdjacentHTML(
                    'afterend' ,
                    '<a target="_blank" href="'
                            + URL_to_titles
                            + '" style="display:block;margin-top:8px;color:orange;background-color:#666;padding:4px"><b>TITLES CHECK ></b></a>');

    // URL schemes
    // http://www.shutterstock.com/cat.mhtml?page=1&thumb_size=small&submitter_id=328114&search_type=gallery
    // http://www.shutterstock.com/cat.mhtml?gallery_id=328114
    // submitter=328114
}



// CHECK IF PORTFOLIO PAGES
// var _match = /shutterstock\.com\/gallery-(\d+)p(\d+)\./i.exec(_docLocation);
var _match = /shutterstock\.com\/.*page=(\d+).*submitter_id=(\d+)/i
        .exec(_docLocation);



if (_match) {
    submitter_id = _match[2];

    // var imgs_thumbs = document.querySelectorAll('.gc_thumb > img');
    var imgs_thumbs = document
            .querySelectorAll(".gc > div:first-child > a > img");

    var imgs_alt = new Array();
    var i;
    var img;

    var css = ' .gc, .gc_thumb { display:block;line-height:12pt;font-size:9pt;float:none; width:800px !important; height:auto !important; text-align:left;padding:4px !important;'
            + 'padding-top:4px !important; padding-left:4px !important; background-color:#fff !important; border:0px !important; border-bottom:2px solid #eee;margin-bottom:10px;}'
            + ' .gc_thumb {float:left !important; width:400px !important;}'
            + ' .gc_desc {display:none !important}'
            + ' .gc * img {float:left;margin-top:2px;margin-right:8px;width:60px}'
            + ' .gc div {height:auto}'
            + ' .gc_btns {display:none !important;}'
            + ' .gc_thumb:hover { background-color:#eef !important; }'
            + ' .plr_edit_btn {display:block; margin:auto; padding:4px; padding-top:5px !important; padding-left:4px !important; width:120px;float:left !important; }'
            + ' .total_pages_pagination {line-height:15pt; margin:4px;font-weight:bold;height:40px}'
            + ' .mark_here {color:red;border:1px solid red;padding:4px}'
            + ' </style>';

    var head = document.head || document.getElementsByTagName('head')[0], style = document
            .createElement('style');
    style.type = 'text/css';

    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);

    var edit_URL = 'http://submit.shutterstock.com/edit_media.mhtml?type=photos&approved=1&id=';
    var img_id;
    var re;
    var words_rep = {};
    var title_new = '';

    // Silly JS
    // http://stackoverflow.com/questions/141280/whats-the-best-way-to-count-keywords-in-javascript

    function check_repeats(text) {
        var words_rep = {};
        words_in_title = text.split(" ");

        for ( var i = 0; i < words_in_title.length; i++ ) {
            if (words_rep.hasOwnProperty(words_in_title[i].toLowerCase()) == false) {
                words_rep[words_in_title[i].toLowerCase()] = 0;
            }
            words_rep[words_in_title[i].toLowerCase()] = words_rep[words_in_title[i]
                    .toLowerCase()] + 1;

        }

        title_new = '';

        for ( var i = 0; i < words_in_title.length; i++ ) {

            if (words_rep[words_in_title[i].toLowerCase()] > 1)
                title_new += '<b style="color:red">' + words_in_title[i]
                        + '</b> ';
            else
                title_new += words_in_title[i] + ' ';

        }
        checked = title_new + ' ';
        return checked;
    }

    function pseudospam_check() {

        /* http://stackoverflow.com/questions/524696/how-to-create-a-style-tag-with-javascript */

        for ( i = 0; i < imgs_thumbs.length; i++ ) {
            imgs_alt[i] = imgs_thumbs[i].getAttribute('alt');
        }

        // http://www.shutterstock.com/pic-371668693/stock-photo-calhau-crater-cape-verde-sao-vicente-island-single-rock-martian-like-dry-red-ground-surface.html?src=tr0b4Z8SVbfgFBGS1J79Ow-1-0
        // shutterstock.com/pic-371668693/

        imgs_thumbs = document.querySelectorAll(".gc_thumb");
        edit_link = '';

        for ( var i = 0; i < imgs_thumbs.length; i++ ) {
            img_url = imgs_thumbs[i].href; // .getAttribute("href");
            re = new RegExp("shutterstock\.com\/pic\-(\\d+)\/");

            img_id = re.exec(img_url);
            if (img_id != null)
                img_id = img_id[1];
            else
                img_id = '???';

            edit_link = ' ' + '<a target="_blank" href="' + edit_URL + img_id
                    + '"><b>EDIT</b> - ' + img_id + ' </a>';
            edit_link = '<div class="plr_edit_btn">' + edit_link + '</div';

            imgs_thumbs[i].insertAdjacentHTML('beforebegin' , edit_link);
            title_checked = check_repeats(imgs_alt[i]);
            imgs_thumbs[i].insertAdjacentHTML('beforeend' , '<span>'
                    + title_checked + '</span>');

        }

    }

    // grid_pager_next_top.onclick = function () { location.reload(); };
    // grid_pager_prev_top.onclick = function () { location.reload(); };

    // grid_pager_next_top.onclick = function () { pseudospam_check(); };
    // window.onload = function () { pseudospam_check(); };
    // pseudospam_check();

    grid_pager_next_top.onclick = '';
    // grid_pager_button_next.onclick = '';
    grid_pager_prev_top.onclick = '';
    // grid_pager_button_prev.onclick = '';

    total_pages = document.getElementById('grid_pager_top').textContent;

    re = new RegExp("of (\\d+)");
    _match = re.exec(total_pages);

    if (_match != null) {
        total_pages = parseInt(_match[1]);
    } else {
        alert('Problem while extracting: total_pages');
        total_pages = 0;
    }

    btn_URL = document.getElementById('grid_pager_next_top').href;

    if (btn_URL != null) {
        re = new RegExp("shutterstock\.com\/gallery-(\\d+)p(\\d+)\.");
        _match = re.exec(btn_URL);

    }

    if (_match != null) {
        // submitter_id = _match[1];
        page_id_next = _match[2];
        page_id_prev = page_id_next - 2;

        if (page_id_prev < 1) {
            page_id_prev = 1;
        }

        if (page_id_next > total_pages) {
            page_id_next = total_pages;
        }

        page_id_curr = page_id_next - 1;

    } else {
        page_id_next = total_pages;
        page_id_prev = total_pages - 1;
        page_id_curr = total_pages;
    }


    new_URL_next = 'http://www.shutterstock.com/cat.mhtml?page=' + page_id_next
            + '&thumb_size=small&submitter_id=' + submitter_id
            + '&search_type=gallery';
    new_URL_prev = 'http://www.shutterstock.com/cat.mhtml?page=' + page_id_prev
            + '&thumb_size=small&submitter_id=' + submitter_id
            + '&search_type=gallery';

    // CREATE:
    // http://www.shutterstock.com/cat.mhtml?page=5&thumb_size=small&submitter_id=328114&search_type=gallery&search_language=en&safesearch=0

    // CREATE PAGINATION, because click buttons sometimes don't work properly,
    // due the JS events
    // I'm not going to cover every aspect of the site, it's just a quick and
    // dirty tool

    total_pages_pagination = 'PAGE: ';
    for ( var i = 1; i <= total_pages; i++ ) {
        if (page_id_curr == i)
            class_mark = 'class="mark_here"';
        else
            class_mark = '';

        page_URL = 'http://www.shutterstock.com/cat.mhtml?page=' + i
                + '&thumb_size=small&submitter_id=' + submitter_id
                + '&search_type=gallery';
        page_HREF = '<a ' + class_mark + ' href="' + page_URL + '">' + i
                + '</a>'
        total_pages_pagination += page_HREF + ', ';
    }

    total_pages_pagination = total_pages_pagination.replace(/,\s*$/ , "");
    total_pages_pagination = '<div class="total_pages_pagination">'
            + total_pages_pagination + '</div>';
    document.getElementById('filters_and_related').insertAdjacentHTML(
            'afterend' , total_pages_pagination);

    grid_pager_next_top.onclick = function() {
        window.location.href = new_URL_next;
    };
    grid_pager_prev_top.onclick = function() {
        window.location.href = new_URL_prev;
    };

    //  grid_pager_button_next.onclick = function () { window.location.href = document.getElementById('grid_pager_next_top').href + '&search_type=gallery';  };

    //  alert( document.getElementById('grid_pager_next_top').href );

    window.onload = function() {
        pseudospam_check();
    };
    //  pseudospam_check();

}
