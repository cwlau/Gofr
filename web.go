/*****************************************************************************
 **
 ** Gofr
 ** https://github.com/melllvar/Gofr
 ** Copyright (C) 2013 Akop Karapetyan
 **
 ** This program is free software; you can redistribute it and/or modify
 ** it under the terms of the GNU General Public License as published by
 ** the Free Software Foundation; either version 2 of the License, or
 ** (at your option) any later version.
 **
 ** This program is distributed in the hope that it will be useful,
 ** but WITHOUT ANY WARRANTY; without even the implied warranty of
 ** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 ** GNU General Public License for more details.
 **
 ** You should have received a copy of the GNU General Public License
 ** along with this program; if not, write to the Free Software
 ** Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
 **
 ******************************************************************************
 */
 
package gofr

import (
  "html/template"
  "net/http"
)

var indexTemplate = template.Must(template.New("index").Parse(indexTemplateHTML))

func registerWeb() {
  RegisterHTMLRoute("/", index)
  RegisterHTMLRoute("/ang", angularIndex)
}

func index(pfc *PFContext) {
  if err := indexTemplate.Execute(pfc.W, nil); err != nil {
    http.Error(pfc.W, err.Error(), http.StatusInternalServerError)
  }
}

func angularIndex(pfc *PFContext) {
  pfc.W.Write([]byte(angularIndexTemplateHTML))
}
