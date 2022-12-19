/*
 * WarmRoast
 * Copyright (C) 2013 Albert Pham <http://www.sk89q.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

package com.sk89q.warmroast;

import java.io.IOException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public class StackNode implements Comparable<StackNode> {

    final String name;
    private final Map<String, StackNode> children = new HashMap<>();
    long totalTime;

    public StackNode(String name) {
        this.name = name;
    }

    private Collection<StackNode> getChildren() {
        List<StackNode> list = new ArrayList<>(children.values());
        Collections.sort(list);
        return list;
    }
    
    private StackNode getChild(String className, String methodName) {
        StackTraceNode node = new StackTraceNode(className, methodName);
        StackNode child = children.get(node.name);
        if (child == null) {
            child = node;
            children.put(node.name, node);
        }
        return child;
    }
    
    private void log(StackTraceElement[] elements, int skip, long time) {
        totalTime +=time;
        
        if (elements.length - skip == 0) {
            return;
        }
        
        StackTraceElement bottom = elements[elements.length - (skip + 1)];
        getChild(bottom.getClassName(), bottom.getMethodName())
                .log(elements, skip + 1, time);
    }
    
    public void log(StackTraceElement[] elements, long time) {
        log(elements, 0, time);
    }

    @Override
    public int compareTo(StackNode o) {
        return name.compareTo(o.name);
    }

    public void writeJSON(Writer out) throws IOException {
        writeJSON(out, totalTime);
    }

    private void writeJSON(Writer out, long totalTime) throws IOException {
        out.write("\"");
        out.write(name.replace("\\", "\\\\").replace("\"", "\\\""));
        out.write("\":{\"timeMs\":");
        out.write(Long.toString(totalTime));
        out.write(",\"percent\":");
        out.write(String.format("%.2f", totalTime / (double) totalTime * 100));
        out.write(",\"children\":{");
        for(Iterator<StackNode> it = getChildren().iterator(); it.hasNext();) {
            it.next().writeJSON(out, totalTime);
            if(it.hasNext()) out.write(',');
        }
        out.write("}}");
    }

    private void writeString(StringBuilder builder, int indent) {
        StringBuilder b = new StringBuilder();
        for (int i = 0; i < indent; i++) {
            b.append(" ");
        }
        String padding = b.toString();
        
        for (StackNode child : getChildren()) {
            builder.append(padding).append(child.name);
            builder.append(" ");
            builder.append(totalTime).append("ms");
            builder.append("\n");
            child.writeString(builder, indent + 1);
        }
    }
    
    @Override
    public String toString() {
        StringBuilder builder = new StringBuilder();
        writeString(builder, 0);
        return builder.toString();
    }
}
