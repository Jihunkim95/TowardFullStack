//
//  APIViewModel.swift
//  CleanArea_TestDemo
//
//  Created by 김지훈 on 2023/12/11.
//

import Foundation

class APIViewModel: ObservableObject{
    
    @Published var result: [YouthPolicy] = []
    
    func fetchYouthPolicies() {
        guard let url = URL(string: "http://localhost:3000/youth-policies") else {
            print("Invalid URL")
            return
        }

        let task = URLSession.shared.dataTask(with: url) { (data, response, error) in
            if let error = error {
                print("Error with fetching data: \(error)")
                return
            }

            guard let httpResponse = response as? HTTPURLResponse,
                  (200...299).contains(httpResponse.statusCode),
                  let data = data else {
                print("Error with the response, unexpected status code: \(response)")
                return
            }

            do {
                let decoder = JSONDecoder()
                let policies = try decoder.decode([YouthPolicy].self, from: data)
                DispatchQueue.main.async {
                    // SwiftUI 뷰를 업데이트하는 코드
                    self.result = policies
                }
            } catch {
                print("JSON Decoding Error: \(error)")
            }
        }

        task.resume()
    }

}
