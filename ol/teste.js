var UList = {
        app_running: !1,
        api_error: !1,
        app_init: function() { this.app_running = !0, this.api_error = !1 },
        set_api_key: function(t) { this.API_KEY = t },
        app_reset: function() { this.app_running = !1, this.api_error = !1 },
        is_browser_compatible: function() { try { return !!new Blob } catch (t) { return !1 } },
        is_running: function() { return this.app_running },
        get_script: function(t, e, i) {
            var a, s;
            a = document.getElementsByTagName("head")[0], s = document.createElement("script"), s.defer = "defer", s.src = t, s.addEventListener("load", function() { a.removeChild(s), "function" == typeof e && e() }, !1), s.addEventListener("error", function() { a.removeChild(s), "function" == typeof i && i() }, !1), a.appendChild(s)
        },
        channel_valid_id: function(t) { var e, i = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/channel\/(UC[a-zA-Z0-9_-]{22})/; return e = t.match(i), null === e ? !1 : e[1] },
        channel_valid_username: function(t) { var e, i = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:user|c)\/([^?/]{1,50})/; return e = t.match(i), null === e ? !1 : e[1] },
        playlist_valid_id: function(t) { var e, i = /^(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be\.com\/(?:watch|playlist)\?)(?:.*&)?list=((?:RD|[FPL]L)[a-zA-Z0-9_-]+)/; return e = t.match(i), null === e ? !1 : e[1] },
        api_playlist_default_url: function(t) { var e; return e = "https://www.googleapis.com/youtube/v3/playlists?" + $.param({ alt: "json", maxResults: 1, prettyPrint: "false", part: "contentDetails,snippet", fields: "items(id,snippet(publishedAt,channelId,title,description,thumbnails(medium(url)),channelTitle),contentDetails(itemCount))", callback: t, key: this.API_KEY }) },
        api_playlist_list_default_url: function(t) { var e; return e = "https://www.googleapis.com/youtube/v3/playlistItems?" + $.param({ alt: "json", prettyPrint: "false", maxResults: 50, part: "contentDetails", fields: "nextPageToken,items(contentDetails(videoId))", callback: t, key: this.API_KEY }) },
        api_channel_default_url: function(t) { var e; return e = "https://www.googleapis.com/youtube/v3/channels?" + $.param({ alt: "json", prettyPrint: "false", part: "contentDetails,snippet,statistics", fields: "items(id,snippet(title,description,publishedAt,thumbnails(medium(url))),contentDetails(relatedPlaylists(uploads)),statistics(viewCount,subscriberCount,hiddenSubscriberCount,videoCount))", callback: t, key: this.API_KEY }) },
        api_playlist_generate_url: function(t, e) { return this.api_playlist_default_url(t) + "&" + $.param({ id: e }) },
        api_playlist_list_generate_url: function(t, e) { return this.api_playlist_list_default_url(t) + "&" + $.param({ playlistId: e }) },
        api_channel_generate_url: function(t, e) { return this.api_channel_default_url(t) + "&" + $.param({ id: e }) },
        api_username_generate_url: function(t, e) { return this.api_channel_default_url(t) + "&" + $.param({ forUsername: e }) }
    },
    UList_Data = {
        playlist: {},
        channel: {},
        init: function() { this.JSON = "", this.playlist = { id: "", owner_name: "", owner_id: "", title: "", description: "", published_at: "", thumbnail: "", total_videos: 0, video_ids: [], fetched_videos: 0, next_page_token: "" }, this.channel = { id: "", username: "", title: "", description: "", created_at: "", subscribers: 0, thumbnail: "", total_uploads: 0, total_views: 0, uploads_playlist: "", video_ids: [], fetched_videos: 0, next_page_token: "" } },
        json_store: function(t) { this.JSON = t },
        get_channel_id: function() { return this.channel.id },
        get_channel_total_uploads: function() { return this.channel.total_uploads },
        get_uploads_playlist: function() { return this.channel.uploads_playlist },
        get_playlist_id: function() { return this.playlist.id },
        get_playlist_title: function() { return this.playlist.title },
        set_username: function(t) { this.channel.username = t },
        generate_video_urls: function(t) {
            var e, i = t.length,
                a = "";
            for (e = 0; i > e; e++) a += "https://www.youtube.com/watch?v=" + t[e], e !== i - 1 && (a += "\r\n");
            return a
        }
    },
    UList_HTML = {
        init: function() { this.file_downloaded = null, this.page_title = document.title, this.user_notify = !0, this.audio_playing = !1, this.objects = { main_site: document.getElementById("site-main"), main_form: document.getElementById("main-form"), main_input: document.getElementById("youtube-url"), btn_notify: document.getElementById("btn-notify"), div_notify: document.getElementById("audio-play"), btn_submit: document.getElementById("btn-submit"), btn_submit_icon: document.getElementById("btn-submit-icon"), div_limit: document.getElementById("result-limit"), btns_limit: document.getElementById("btns-result-limit"), div_result: document.getElementById("result-main"), div_progress: document.getElementById("info-progress"), progress_bar: document.getElementById("progress-bar"), progress_text: document.getElementById("progress-text"), div_download: document.getElementById("info-download"), btn_download: document.getElementById("btn-download") } },
        has_downloaded_file: function() { return this.file_downloaded },
        site_disable: function() { $(this.objects.main_site).addClass("site-disable") },
        form_init: function() {
            var t = this.objects.btn_submit,
                e = this.objects.btn_submit_icon;
            this.file_downloaded = null, t.disabled = !0, $(t).removeClass("youtube-bg-btn"), $(e).removeClass("glyphicon-play youtube-color-btn").addClass("glyphicon-refresh glyphicon-refresh-animate")
        },
        form_reset: function() {
            var t = this.objects.btn_submit,
                e = this.objects.btn_submit_icon;
            t.disabled = !1, $(t).addClass("youtube-bg-btn"), $(e).removeClass("glyphicon-refresh glyphicon-refresh-animate").addClass("youtube-color-btn glyphicon-play")
        },
        show_popover_message: function(t, e) {
            var i = this.objects.main_input;
            $(i).popover({ trigger: "manual", title: t, content: e }), $(i).popover("show")
        },
        hide_popover_message: function() {
            var t = this.objects.main_input;
            $(t).popover("destroy")
        },
        date_format: function(t) { var e = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]; return e[t.getMonth()] + " de " + t.getFullYear() },
        number_format: function(t, e, i, a) {
            t = (t + "").replace(/[^0-9+\-Ee.]/g, "");
            var s = isFinite(+t) ? +t : 0,
                n = isFinite(+e) ? Math.abs(e) : 0,
                l = "undefined" == typeof a ? "," : a,
                o = "undefined" == typeof i ? "." : i,
                r = "",
                d = function(t, e) { var i = Math.pow(10, e); return "" + (Math.round(t * i) / i).toFixed(e) };
            return r = (n ? d(s, n) : "" + Math.round(s)).split("."), r[0].length > 3 && (r[0] = r[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, l)), (r[1] || "").length < n && (r[1] = r[1] || "", r[1] += new Array(n - r[1].length + 1).join("0")), r.join(o)
        },
        locale_number_format: function(t, e) {
            var i, a, s, n, l = [1e3, 1e6, 1e9],
                o = ["mil", "milhão", "bilhão"],
                r = ["mil", "milhões", "bilhões"];
            for (n = l.length, i = t, s = 0; n > s; s++) t >= l[s] && (i = "", a = Math.floor(t / l[s]), i += 0 === t % l[s] ? a : !0 === e ? a + "+" : a, i += " ", i += a > 1 ? r[s] : o[s]);
            return i
        },
        clean_div: function(t) { for (; null !== t.firstChild;) t.removeChild(t.firstChild) },
        create_button: function(t, e, i) { var a; return a = document.createElement("button"), a.appendChild(document.createTextNode(e)), a.className = i, t.appendChild(a), a },
        handle_script_limit: function(t) {
            var e, i, a;
            e = this.objects.btns_limit, i = this.create_button(e, "Sim", "btn btn-primary"), a = this.create_button(e, "Não", "btn btn-danger"), i.addEventListener("click", function() { i.disabled = !0, a.disabled = !0, $(this.objects.div_limit).slideUp("slow", function() { e.removeChild(i), e.removeChild(a), t() }) }.bind(this), !1), a.addEventListener("click", function() { i.disabled = !0, a.disabled = !0, $(this.objects.div_limit).slideUp("slow", function() { e.removeChild(i), e.removeChild(a), UList.app_reset(), this.form_reset() }.bind(this)) }.bind(this), !1), $(this.objects.div_limit).slideDown("slow")
        },
        show_playlist_details: function() {
            var t, e, i, a, s, n, l, o, r, d, _, c, u, p, h, m = this.objects.div_result,
                b = this.objects.div_progress,
                L = this.objects.div_download;
            t = UList_Data.JSON.items[0], UList_Data.playlist.id = t.id, UList_Data.playlist.owner_name = t.snippet.channelTitle, UList_Data.playlist.owner_id = t.snippet.channelId, UList_Data.playlist.title = t.snippet.title, UList_Data.playlist.description = t.snippet.description, "1970-01-01T00:00:00.000Z" !== t.snippet.publishedAt ? (e = new Date(t.snippet.publishedAt), e = !0 === isNaN(e) ? "" : e) : e = "", UList_Data.playlist.published_at = e, UList_Data.playlist.thumbnail = t.snippet.thumbnails["medium"].url, UList_Data.playlist.total_videos = t.contentDetails.itemCount, this.update_hash_url("playlist", UList_Data.playlist.id, UList_Data.playlist.title), $(m).hide(), $(b).hide(), $(L).hide(), this.reset_progress_bar(), this.clean_div(m), i = document.createElement("div"), i.className = "result-tab", i.appendChild(document.createTextNode("Playlist")), m.appendChild(i), a = document.createElement("div"), a.className = "clearfix", m.appendChild(a), s = document.createElement("div"), s.className = "result-infos", m.appendChild(s), n = document.createElement("div"), n.className = "result-thumbnail", n.style.backgroundImage = "url(" + UList_Data.playlist.thumbnail + ")", s.appendChild(n), d = document.createElement("div"), d.className = "result-details", _ = document.createElement("div"), _.className = "result-title", o = document.createElement("a"), "R" === UList_Data.playlist.id[0] && "D" === UList_Data.playlist.id[1] ? (r = UList_Data.playlist.thumbnail.match(/\/vi\/([a-zA-Z0-9_-]{11})\//), r = null === r ? "dQw4w9WgXcQ" : r[1], o.href = "https://www.youtube.com/watch?v=" + r + "&list=" + UList_Data.playlist.id) : o.href = "https://www.youtube.com/playlist?list=" + UList_Data.playlist.id, o.setAttribute("data-container", "body"), o.setAttribute("data-toggle", "tooltip"), o.setAttribute("data-placement", "top"), o.title = UList_Data.playlist.title, o.target = "_blank", o.appendChild(document.createTextNode(UList_Data.playlist.title)), _.appendChild(o), d.appendChild(_), c = document.createElement("div"), c.className = "result-summary", p = document.createElement("ul"), h = document.createElement("li"), h.appendChild(document.createTextNode("por ")), o = document.createElement("a"), o.href = "https://www.youtube.com/channel/" + UList_Data.playlist.owner_id, o.target = "_blank", o.appendChild(document.createTextNode(UList_Data.playlist.owner_name)), h.appendChild(o), p.appendChild(h), h = document.createElement("li"), l = document.createElement("span"), l.setAttribute("data-container", "body"), l.setAttribute("data-toggle", "tooltip"), l.setAttribute("data-placement", "bottom"), l.title = "± " + this.number_format(UList_Data.playlist.total_videos, 0, ".", "."), l.appendChild(document.createTextNode(this.locale_number_format(UList_Data.playlist.total_videos) + (UList_Data.playlist.total_videos > 1 ? " vídeos" : " vídeo"))), h.appendChild(l), p.appendChild(h), "" !== UList_Data.playlist.published_at && (h = document.createElement("li"), l = document.createElement("span"), l.setAttribute("data-container", "body"), l.setAttribute("data-toggle", "tooltip"), l.setAttribute("data-placement", "bottom"), l.title = UList_Data.playlist.published_at.toLocaleString(), l.appendChild(document.createTextNode(this.date_format(UList_Data.playlist.published_at))), h.appendChild(l), p.appendChild(h)), c.appendChild(p), d.appendChild(c), "" !== UList_Data.playlist.description && (u = document.createElement("div"), u.className = "result-description text-muted", u.appendChild(document.createTextNode(UList_Data.playlist.description)), d.appendChild(u)), s.appendChild(d), $('[data-toggle="tooltip"]').tooltip(), $(m).slideDown("slow"), $(b).slideDown("slow")
        },
        show_channel_details: function() {
            var t, e, i, a, s, n, l, o, r, d, _, c, u, p, h = this.objects.div_result,
                m = this.objects.div_progress,
                b = this.objects.div_download;
            t = UList_Data.JSON.items[0], UList_Data.channel.id = t.id, UList_Data.channel.title = t.snippet.title, e = new Date(t.snippet.publishedAt), UList_Data.channel.created_at = !0 === isNaN(e) ? "" : e, UList_Data.channel.subscribers = !0 === t.statistics.hiddenSubscriberCount ? !1 : +t.statistics.subscriberCount, UList_Data.channel.thumbnail = t.snippet.thumbnails["medium"].url, UList_Data.channel.total_uploads = +t.statistics.videoCount, UList_Data.channel.total_views = t.statistics.viewCount, UList_Data.channel.uploads_playlist = t.contentDetails.relatedPlaylists.uploads, "" !== UList_Data.channel.username ? this.update_hash_url("user", UList_Data.channel.username, UList_Data.channel.title) : this.update_hash_url("channel", UList_Data.channel.id, UList_Data.channel.title), $(h).hide(), $(m).hide(), $(b).hide(), this.reset_progress_bar(), this.clean_div(h), i = document.createElement("div"), i.className = "result-tab", i.appendChild(document.createTextNode("Canal")), h.appendChild(i), a = document.createElement("div"), a.className = "clearfix", h.appendChild(a), s = document.createElement("div"), s.className = "result-infos", h.appendChild(s), n = document.createElement("div"), n.className = "result-thumbnail", n.style.backgroundImage = "url(" + UList_Data.channel.thumbnail + ")", s.appendChild(n), r = document.createElement("div"), r.className = "result-details", d = document.createElement("div"), d.className = "result-title", o = document.createElement("a"), "" !== UList_Data.channel.username ? o.href = "https://www.youtube.com/user/" + UList_Data.channel.username : o.href = "https://www.youtube.com/channel/" + UList_Data.channel.id, o.target = "_blank", o.setAttribute("data-container", "body"), o.setAttribute("data-toggle", "tooltip"), o.setAttribute("data-placement", "top"), o.title = UList_Data.channel.title, o.appendChild(document.createTextNode(UList_Data.channel.title)), d.appendChild(o), r.appendChild(d), _ = document.createElement("div"), _.className = "result-summary", u = document.createElement("ul"), "" !== UList_Data.channel.created_at && (p = document.createElement("li"), l = document.createElement("span"), l.appendChild(document.createTextNode(this.date_format(UList_Data.channel.created_at))), l.setAttribute("data-container", "body"), l.setAttribute("data-toggle", "tooltip"), l.setAttribute("data-placement", "bottom"), l.title = UList_Data.channel.created_at.toLocaleString(), p.appendChild(l), u.appendChild(p)), !1 !== UList_Data.channel.subscribers && 0 !== UList_Data.channel.subscribers && (p = document.createElement("li"), l = document.createElement("span"), l.appendChild(document.createTextNode(this.locale_number_format(UList_Data.channel.subscribers, !1) + (1 === UList_Data.channel.subscribers ? " inscrito" : " inscritos"))), l.setAttribute("data-container", "body"), l.setAttribute("data-toggle", "tooltip"), l.setAttribute("data-placement", "bottom"), l.title = "± " + this.number_format(UList_Data.channel.subscribers, 0, ".", "."), p.appendChild(l), u.appendChild(p)), p = document.createElement("li"), l = document.createElement("span"), l.appendChild(document.createTextNode(this.locale_number_format(UList_Data.channel.total_uploads, !1) + (UList_Data.channel.total_uploads > 1 ? " vídeos" : " vídeo"))), l.setAttribute("data-container", "body"), l.setAttribute("data-toggle", "tooltip"), l.setAttribute("data-placement", "bottom"), l.title = "± " + this.number_format(UList_Data.channel.total_uploads, 0, ".", "."), p.appendChild(l), u.appendChild(p), 0 !== UList_Data.channel.total_views && (p = document.createElement("li"), l = document.createElement("span"), l.appendChild(document.createTextNode(this.locale_number_format(UList_Data.channel.total_views, !1) + (1 === UList_Data.channel.total_views ? " visualização" : " visualizações"))), l.setAttribute("data-container", "body"), l.setAttribute("data-toggle", "tooltip"), l.setAttribute("data-placement", "bottom"), l.title = "± " + this.number_format(UList_Data.channel.total_views, 0, ".", "."), p.appendChild(l), u.appendChild(p)), _.appendChild(u), r.appendChild(_), "" !== UList_Data.channel.description && (c = document.createElement("div"), c.className = "result-description text-muted", c.appendChild(document.createTextNode(UList_Data.channel.description)), r.appendChild(c)), s.appendChild(r), $('[data-toggle="tooltip"]').tooltip(), $(h).slideDown("slow"), $(m).slideDown("slow")
        },
        list_playlist_videos: function(t) {
            var e;
            e = UList.api_playlist_list_generate_url("UList_HTML.playlist_parse", t), "" !== UList_Data.playlist.next_page_token && (e += "&" + $.param({ pageToken: UList_Data.playlist.next_page_token })), UList.get_script(e, void 0, function() { this.handle_script_error("Playlist", 10, function() { this.list_playlist_videos(UList_Data.get_playlist_id()) }.bind(this)) }.bind(this))
        },
        list_channel_videos: function(t) {
            var e;
            e = UList.api_playlist_list_generate_url("UList_HTML.channel_parse", t), "" !== UList_Data.channel.next_page_token && (e += "&" + $.param({ pageToken: UList_Data.channel.next_page_token })), UList.get_script(e, void 0, function() { this.handle_script_error("Channel", 10, function() { this.list_channel_videos(UList_Data.get_uploads_playlist()) }.bind(this)) }.bind(this))
        },
        handle_script_error: function(t, e, i) {
            var a, s, n;
            console.log("[" + t + "] YouTube API Error. Sleeping " + e + "s before next request."), s = this.objects.progress_bar, n = this.objects.progress_text, $(s).addClass("progress-bar-danger").removeClass("progress-bar-info"), a = setInterval(function() { e--, 0 === e ? (clearInterval(a), n.textContent = "", $(s).addClass("progress-bar-info").removeClass("progress-bar-danger"), i()) : n.textContent = "(Erro! Tentando novamente em " + e + "s)" }.bind(this), 1e3)
        },
        playlist_parse: function(t) {
            var e, i, a, s, n, l;
            if ("undefined" != typeof t.error) return void this.handle_script_error("Playlist", 10, function() { this.list_playlist_videos(UList_Data.get_playlist_id()) }.bind(this));
            for (e = t.items, a = e.length, s = 0; a > s; s++) i = e[s].contentDetails, UList_Data.playlist.video_ids.push(i.videoId);
            UList_Data.playlist.fetched_videos += a, n = UList_Data.playlist.total_videos > 1e5 ? 1e5 : UList_Data.playlist.total_videos, l = UList_Data.playlist.fetched_videos / n * 100, this.set_progressbar_value(l, UList_Data.playlist.title), "undefined" == typeof t.nextPageToken ? (UList.app_reset(), this.form_reset(), this.finish_progress_bar(UList_Data.playlist.title), $(this.objects.div_download).show("slow", function() { this.bind_download(UList_Data.playlist.title, UList_Data.playlist.video_ids), this.notify_user() }.bind(this))) : (UList_Data.playlist.next_page_token = t.nextPageToken, this.list_playlist_videos(UList_Data.get_playlist_id()))
        },
        channel_parse: function(t) {
            var e, i, a, s, n, l;
            if ("undefined" != typeof t.error) return void this.handle_script_error("Channel", 10, function() { this.list_channel_videos(UList_Data.get_uploads_playlist()) }.bind(this));
            for (e = t.items, a = e.length, s = 0; a > s; s++) i = e[s].contentDetails, UList_Data.channel.video_ids.push(i.videoId);
            UList_Data.channel.fetched_videos += a, n = UList_Data.channel.total_uploads > 99999 ? 1e5 : UList_Data.channel.total_uploads, l = UList_Data.channel.fetched_videos / n * 100, this.set_progressbar_value(l, UList_Data.channel.title), "undefined" == typeof t.nextPageToken ? (UList.app_reset(), this.form_reset(), this.finish_progress_bar(UList_Data.channel.title), $(this.objects.div_download).show("slow", function() { this.bind_download(UList_Data.channel.title, UList_Data.channel.video_ids), this.notify_user() }.bind(this))) : (UList_Data.channel.next_page_token = t.nextPageToken, this.list_channel_videos(UList_Data.get_uploads_playlist()))
        },
        reset_progress_bar: function() {
            var t, e;
            document.title = this.page_title, e = this.objects.progress_text, t = this.objects.progress_bar, e.textContent = "", $(t).addClass("active progress-bar-info").removeClass("progress-bar-success"), this.set_progressbar_value(0)
        },
        finish_progress_bar: function(t) {
            var e, i;
            i = this.objects.progress_text, e = this.objects.progress_bar, i.textContent = "(Finalizado!)", $(e).addClass("progress-bar-success").removeClass("active progress-bar-info"), this.set_progressbar_value(100, t)
        },
        set_progressbar_value: function(t, e) { var i, a = Math.floor(t); "undefined" != typeof e && (document.title = a + "% · " + e + " - " + this.page_title), i = this.objects.progress_bar, i.style.width = a + "%", i.setAttribute("aria-valuenow", a), i.textContent = (a > 9 && 0 === a % 10 ? a : t.toFixed(2)) + "%" },
        bind_download: function(t, e) {
            this.file_downloaded = !1, this.objects.btn_download.onclick = function() {
                var i;
                this.file_downloaded = !0, i = UList_Data.generate_video_urls(e), saveTextAs(i, t.replace(/[\\\/:*?"<>|]/g, "") + ".txt")
            }.bind(this)
        },
        notify_user: function(t) {!0 !== this.user_notify && !0 !== t || !1 !== this.audio_playing || (this.objects.div_notify.play(), this.audio_playing = !0, this.objects.div_notify.onended = function() { this.audio_playing = !1 }.bind(this)) },
        clear_notify: function() { this.audio_playing = !1 },
        handle_hash_url: function() {
            var t, e, i = window.location.hash,
                a = !0,
                s = this.objects.main_input,
                n = this.objects.btn_submit;
            !0 !== UList.is_running && (null !== (t = i.match(/^#!\/channel\/(UC[a-zA-Z0-9_-]{22})$/)) ? e = "https://www.youtube.com/channel/" + t[1] : null !== (t = i.match(/^#!\/user\/([^?/]{1,50})$/)) ? e = "https://www.youtube.com/user/" + t[1] : null !== (t = i.match(/^#!\/playlist\/((?:RD|[FPL]L)[a-zA-Z0-9_-]+)$/)) ? e = "https://www.youtube.com/playlist?list=" + t[1] : a = !1, !0 === a && (this.hide_popover_message(), s.value = e, n.click()))
        },
        update_hash_url: function(t, e, i) { window.location.hash = "#!/" + t + "/" + e, document.title = i + " - " + this.page_title }
    };
$(document).ready(function() {
    var t, e, i, a, s = !1;
    $('[data-toggle="tooltip"]').tooltip(), UList_HTML.init(), t = UList_HTML.objects.main_form, e = UList_HTML.objects.main_input, i = UList_HTML.objects.btn_notify, UList.set_api_key("AIzaSyCHzxajclsq5TTRO-JQyS-AYwIOqCvfTUg"), e.addEventListener("input", function() { return document.activeElement !== e ? !1 : void UList_HTML.hide_popover_message() }, !1), window.addEventListener("beforeunload", function(t) { var e; return !0 === UList.is_running() && (e = "O site ainda não terminou de criar a lista de links."), !1 === UList_HTML.has_downloaded_file() && (e = "Você ainda não baixou o arquivo."), "undefined" != typeof e ? ((t || window.event).returnValue = e, e) : void 0 }, !1), i.addEventListener("click", function() {!0 === $(i).hasClass("glyphicon-volume-up") ? (UList_HTML.user_notify = !1, $(i).addClass("glyphicon-volume-off").removeClass("glyphicon-volume-up")) : !0 === $(i).hasClass("glyphicon-volume-off") && (UList_HTML.user_notify = !0, $(i).addClass("glyphicon-volume-up").removeClass("glyphicon-volume-off")) }, !1), i.addEventListener("mouseover", function() { s = !0, a = setTimeout(function() {!0 === s && !1 === UList_HTML.audio_playing && UList_HTML.notify_user() }, 500) }, !1), i.addEventListener("mouseout", function() { clearInterval(a), s = !1 }, !1), t.addEventListener("submit", function(t) {
        var i, a = e.value.trim(),
            s = "";
        if (t.preventDefault(), !1 !== UList.is_browser_compatible()) {
            if (!0 === UList.is_running()) return void console.log("Script already running.");
            if (UList_Data.init(), UList_HTML.form_init(), UList.app_init(), (i = UList.playlist_valid_id(a)) !== !1) return s = UList.api_playlist_generate_url("UList_Data.json_store", i), void UList.get_script(s, function() { var t = !0; "undefined" != typeof UList_Data.JSON.error ? (console.log("[Playlist] Internal YouTube API error."), UList_HTML.show_popover_message("Oops", "Ocorreu um erro desconhecido. Tente novamente.")) : 1 !== UList_Data.JSON.items.length ? (console.log("[Playlist] Playlist '" + a + "' doesn't exist or is private."), UList_HTML.show_popover_message("Erro", "Esta playlist não existe ou é privada.")) : 0 === +UList_Data.JSON.items[0].contentDetails.itemCount ? (console.log("[Playlist] Playlist '" + a + "' has no videos."), UList_HTML.show_popover_message("Aviso", "Esta playlist não tem vídeos.")) : +UList_Data.JSON.items[0].contentDetails.itemCount > 1e5 ? (console.log("[Playlist] Playlist '" + a + "' has more than 100.000 videos."), t = !1, UList_HTML.handle_script_limit(function() { UList_HTML.show_playlist_details(), UList_HTML.list_playlist_videos(UList_Data.get_playlist_id()) })) : (t = !1, UList_HTML.show_playlist_details(), UList_HTML.list_playlist_videos(UList_Data.get_playlist_id())), !0 === t && (UList.app_reset(), UList_HTML.form_reset()) }, function() { console.log("[Playlist] Network error."), UList_HTML.show_popover_message("Erro de conexão", "Verifique sua conexão com a Internet e tente novamente."), UList.app_reset(), UList_HTML.form_reset() });
            (i = UList.channel_valid_id(a)) !== !1 ? s = UList.api_channel_generate_url("UList_Data.json_store", i) : (i = UList.channel_valid_username(a)) !== !1 && (s = UList.api_username_generate_url("UList_Data.json_store", i), UList_Data.set_username(i)), "" === s ? (console.log("Unknown Youtube URL '" + a + "'"), UList_HTML.show_popover_message("Erro", "Informe um link válido."), UList.app_reset(), UList_HTML.form_reset()) : UList.get_script(s, function() { var t = !0; "undefined" != typeof UList_Data.JSON.error ? (console.log("[Channel] Internal YouTube API error."), UList_HTML.show_popover_message("Oops", "Ocorreu um erro desconhecido. Tente novamente.")) : 1 !== UList_Data.JSON.items.length ? (console.log("[Channel] Channel '" + a + "' doesn't exist."), UList_HTML.show_popover_message("Erro", "Este canal não existe.")) : 0 === +UList_Data.JSON.items[0].statistics.videoCount ? (console.log("[Channel] Channel '" + a + "' has no videos."), UList_HTML.show_popover_message("Aviso", "Este canal não enviou vídeos.")) : +UList_Data.JSON.items[0].statistics.videoCount > 1e5 ? (console.log("[Channel] Channel '" + a + "' has more than 100.000 uploaded videos."), t = !1, UList_HTML.handle_script_limit(function() { UList_HTML.show_channel_details(), UList_HTML.list_channel_videos(UList_Data.get_uploads_playlist()) })) : (t = !1, UList_HTML.show_channel_details(), UList_HTML.list_channel_videos(UList_Data.get_uploads_playlist())), !0 === t && (UList.app_reset(), UList_HTML.form_reset()) }, function() { console.log("[Channel] Network error."), UList_HTML.show_popover_message("Erro de conexão", "Verifique sua conexão com a Internet e tente novamente."), UList.app_reset(), UList_HTML.form_reset() })
        }
    }, !1), UList_HTML.handle_hash_url(), window.addEventListener("hashchange", function() {!1 === UList.is_running() && UList_HTML.handle_hash_url() }, !1)
});