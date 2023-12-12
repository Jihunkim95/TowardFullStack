//
//  WebSiteView.swift
//  CleanArea
//
//  Created by 노주영 on 12/11/23.
//

import SwiftUI

struct WebSiteView: View {
    @State var isLoading: Bool = false
    @State var url: String
    
    @Binding var isModaling: Bool
    
    var body: some View {
        VStack {
            HStack {
                Button {
                    isModaling.toggle()
                } label: {
                    Image(systemName: "chevron.down")
                        .resizable()
                        .frame(width: 22, height: 17)
                        .foregroundStyle(.mainGreen)
                        .padding(.top, 5)
                }
                Spacer()
            }
            .padding(.horizontal, 20)
            
            ZStack {
                WebSiteLinkView(isLoading: $isLoading, url: url)
                    
                if isLoading {
                    ProgressView()
                        .frame(width: 200, height: 200)
                }
            }
        }
    }
}
