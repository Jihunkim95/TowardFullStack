//
//  StartView.swift
//  CleanArea
//
//  Created by 최동호 on 12/5/23.
//

import SwiftUI

struct StartView: View {
    @StateObject var vm = StartVM()
    @State private var isSearchButtonTapped = false

    var body: some View {
        NavigationStack {
            VStack {
                Spacer()
                HStack {
                    Text("청정구역")
                        .font(.title)
                        .bold()
                        .foregroundStyle(.mainGreen)
                        .padding(.top, 20)
                    Spacer()
                }
                .frame(width: 300)
                .padding()
                
                StartLocationField( type: .residence,
                                    width: 300)
                                .environmentObject(vm)
                StartTextField(text: $vm.employmentStatus,
                               type: .employmentStatus,
                               width: 300)
                                .environmentObject(vm)
                StartTextField(text: $vm.educationLevel,
                               type: .educationLevel,
                               width: 300)
                                .environmentObject(vm)
                StartTextField(text: $vm.age,
                               type: .age,
                               width: 300)
                StartTextField(text: $vm.policyName,
                               type: .policyName,
                               width: 300)
                Spacer()
                                                                                                
                Button {
                    isSearchButtonTapped = true
                } label: {
                    Text("정책검색")
                        .font(.title3)
                        .padding(.horizontal, 50)
                        .frame(height: 50)
                        .background(.buttonGreen)
                        .foregroundColor(.white)
                        .clipShape(RoundedRectangle(cornerRadius: 10))
                        
                }
                .navigationDestination(isPresented: $isSearchButtonTapped) {
                    // 이동할 뷰 (현재 임시 뷰 지정)
                    MainView(vm: self.vm)
                        .navigationBarBackButtonHidden(true)
                }
                                
                Spacer()
            }
        }
    }
}

#Preview {
    StartView(vm: StartVM())
}
