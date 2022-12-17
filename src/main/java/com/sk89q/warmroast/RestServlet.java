package com.sk89q.warmroast;

import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Iterator;

public class RestServlet extends HttpServlet {

  private final WarmRoast roast;

  public RestServlet(WarmRoast roast) {
    this.roast = roast;
  }

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    resp.setContentType("text/json; charset=utf-8");
    resp.setStatus(HttpServletResponse.SC_OK);
    PrintWriter w = resp.getWriter();
    w.print("{");
    synchronized(roast) {
      for(Iterator<StackNode> it = roast.getData().values().iterator(); it.hasNext();) {
        it.next().writeJSON(w);
        if(it.hasNext()) w.write(',');
      }
    }
    w.print("}");
  }
}
